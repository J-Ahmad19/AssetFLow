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

// NEW: Fetch assets and their current verification status for a specific cycle
export const getAuditCycleDetails = async (req: Request, res: Response): Promise<void> => {
  const { audit_cycle_id } = req.params;
  try {
    const connection = await db.getConnection();
    const [assets] = await connection.query(`
      SELECT a.asset_id, a.asset_tag, a.name as asset_name, ar.verification_status 
      FROM assets a 
      LEFT JOIN audit_records ar ON a.asset_id = ar.asset_id AND ar.audit_cycle_id = ?
      WHERE a.lifecycle_status != 'Disposed' AND a.lifecycle_status != 'Retired'
    `, [audit_cycle_id]);
    connection.release();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit details.' });
  }
};

export const createAuditCycle = async (req: Request, res: Response): Promise<void> => {
  const { name, scope_department_id, end_date } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.query(
      `INSERT INTO audit_cycles (name, scope_department_id, start_date, end_date, status) VALUES (?, ?, NOW(), ?, 'Open')`,
      [name, scope_department_id || null, end_date]
    );
    res.status(201).json({ message: 'Audit cycle initiated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit cycle.' });
  } finally {
    connection.release();
  }
};

export const submitAuditRecord = async (req: Request, res: Response): Promise<void> => {
  const { audit_cycle_id, asset_id, verification_status } = req.body;
  const auditor_id = (req as any).user.userId; // Securely grab from JWT

  const connection = await db.getConnection();
  try {
    // Upsert logic: Update if the auditor clicks a different toggle[cite: 5]
    await connection.query(`
      INSERT INTO audit_records (audit_cycle_id, asset_id, auditor_id, verification_status)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE verification_status = VALUES(verification_status)
    `, [audit_cycle_id, asset_id, auditor_id, verification_status]);
    
    res.status(200).json({ message: `Asset marked as ${verification_status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record audit status.' });
  } finally {
    connection.release();
  }
};

export const closeAuditCycle = async (req: Request, res: Response): Promise<void> => {
  const { audit_cycle_id } = req.params;
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction(); 

    await connection.query(`UPDATE audit_cycles SET status = 'Closed' WHERE audit_cycle_id = ?`, [audit_cycle_id]);

    // Auto-generate discrepancies: Mark missing items as 'Lost'[cite: 3, 4]
    await connection.query(`
      UPDATE assets a
      JOIN audit_records ar ON a.asset_id = ar.asset_id
      SET a.lifecycle_status = 'Lost'
      WHERE ar.audit_cycle_id = ? AND ar.verification_status = 'Missing'
    `, [audit_cycle_id]);

    await connection.commit(); 
    res.status(200).json({ message: 'Audit cycle closed. Discrepancies synced to master inventory.' });
  } catch (error) {
    await connection.rollback(); 
    res.status(500).json({ error: 'Database transaction failed during audit closure.' });
  } finally {
    connection.release();
  }
};