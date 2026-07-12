import { Request, Response } from 'express';
import db from '../config/db';

export const getAuditCycles = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await db.getConnection();
    const [cycles] = await connection.query(`
      SELECT ac.*, d.name as department_name 
      FROM audit_cycles ac 
      LEFT JOIN departments d ON ac.scope_department_id = d.department_id 
      ORDER BY ac.created_at DESC
    `);
    connection.release();
    res.status(200).json(cycles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit cycles.' });
  }
};

export const createAuditCycle = async (req: Request, res: Response): Promise<void> => {
  const { name, scope_department_id, start_date, end_date } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.query(
      `INSERT INTO audit_cycles (name, scope_department_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'Open')`,
      [name, scope_department_id || null, start_date, end_date]
    );
    res.status(201).json({ message: 'Audit cycle initiated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit cycle.' });
  } finally {
    connection.release();
  }
};

export const submitAuditRecord = async (req: Request, res: Response): Promise<void> => {
  const { audit_cycle_id, asset_id, auditor_id, verification_status, notes } = req.body;
  const connection = await db.getConnection();
  try {
    // Upsert logic: if an auditor changes their mind, it updates the existing record
    await connection.query(`
      INSERT INTO audit_records (audit_cycle_id, asset_id, auditor_id, verification_status, notes)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE verification_status = VALUES(verification_status), notes = VALUES(notes)
    `, [audit_cycle_id, asset_id, auditor_id, verification_status, notes || null]);
    res.status(200).json({ message: `Asset marked as ${verification_status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record audit status.' });
  } finally {
    connection.release();
  }
};

export const closeAuditCycle = async (req: Request, res: Response): Promise<void> => {
  const { audit_cycle_id } = req.params;
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction(); // ACID: Start

    // 1. Lock the audit cycle
    await connection.query(`UPDATE audit_cycles SET status = 'Closed' WHERE audit_cycle_id = ?`, [audit_cycle_id]);

    // 2. Identify all 'Missing' assets from this cycle and update the master ledger automatically
    await connection.query(`
      UPDATE assets a
      JOIN audit_records ar ON a.asset_id = ar.asset_id
      SET a.lifecycle_status = 'Lost'
      WHERE ar.audit_cycle_id = ? AND ar.verification_status = 'Missing'
    `, [audit_cycle_id]);

    await connection.commit(); // ACID: Commit
    res.status(200).json({ message: 'Audit cycle closed. Discrepancies synced to master inventory.' });
  } catch (error) {
    await connection.rollback(); // ACID: Rollback
    res.status(500).json({ error: 'Database transaction failed during audit closure.' });
  } finally {
    connection.release();
  }
};
// this new added code is for the dashboard controller to handle audit cycle and asset verification functionalities.

export const getActiveAuditDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Replace with your preferred ORM/Query builder execution
    const audit = await (db as any).auditCycle.findUnique({
      where: { id },
      include: { assets: true },
    });

    if (!audit) {
      res.status(404).json({ message: 'Audit cycle not found' });
      return;
    }

    const flaggedAssets = audit.assets.filter(
      (asset: any) => asset.verificationStatus === 'MISSING' || asset.verificationStatus === 'DAMAGED'
    );

    res.json({
      id: audit.id,
      name: audit.name,
      startDate: audit.startDate,
      endDate: audit.endDate,
      auditors: audit.auditors,
      status: audit.status,
      assets: audit.assets,
      flaggedCount: flaggedAssets.length,
      discrepancyReportGenerated: flaggedAssets.length > 0,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAssetVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assetCode, verificationStatus } = req.body;
    
    const validStatuses = ['VERIFIED', 'MISSING', 'DAMAGED', 'PENDING'];
    if (!validStatuses.includes(verificationStatus)) {
      res.status(400).json({ message: 'Invalid verification status value' });
      return;
    }

    const updatedAsset = await (db as any).auditAsset.update({
      where: {
        auditCycleId_assetCode: { auditCycleId: id, assetCode },
      },
      data: { verificationStatus },
    });

    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const closeAuditCycleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const closedAudit = await (db as any).auditCycle.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
    res.json({ message: 'Audit cycle successfully closed', closedAudit });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};