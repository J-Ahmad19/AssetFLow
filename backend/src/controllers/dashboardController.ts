import { Request, Response } from 'express';
import db from '../config/db';

export const getDashboardKPIs = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await db.getConnection();

    // Execute aggregate queries concurrently for optimal performance
    const [
      [availableAssets],
      [allocatedAssets],
      [maintenanceToday],
      [activeBookings],
      [pendingTransfers],
      [upcomingReturns],
      [overdueReturns]
    ] = await Promise.all([
      connection.query(`SELECT COUNT(*) as count FROM assets WHERE lifecycle_status = 'Available'`),
      connection.query(`SELECT COUNT(*) as count FROM assets WHERE lifecycle_status = 'Allocated'`),
      connection.query(`SELECT COUNT(*) as count FROM maintenance_requests WHERE status IN ('Pending', 'In Progress') AND DATE(created_at) = CURDATE()`),
      connection.query(`SELECT COUNT(*) as count FROM bookings WHERE status = 'Ongoing'`),
      connection.query(`SELECT COUNT(*) as count FROM transfer_requests WHERE status = 'Pending'`),
      connection.query(`SELECT COUNT(*) as count FROM allocations WHERE status = 'Active' AND expected_return_date >= CURDATE()`),
      // Overdue returns (past Expected Return Date) are flagged[cite: 5]
      connection.query(`SELECT COUNT(*) as count FROM allocations WHERE status = 'Active' AND expected_return_date < CURDATE()`) 
    ]);

    connection.release();

    // Map results to a structured JSON response
    const kpis = {
      assetsAvailable: (availableAssets as any)[0].count,
      assetsAllocated: (allocatedAssets as any)[0].count,
      maintenanceToday: (maintenanceToday as any)[0].count,
      activeBookings: (activeBookings as any)[0].count,
      pendingTransfers: (pendingTransfers as any)[0].count,
      upcomingReturns: (upcomingReturns as any)[0].count,
      overdueReturns: (overdueReturns as any)[0].count,
    };

    console.log('[Dashboard] Successfully fetched KPI metrics.');
    res.status(200).json(kpis);

  } catch (error) {
    console.error('[Dashboard Error] Failed to fetch KPIs:', error);
    res.status(500).json({ error: 'Internal server error while fetching dashboard data.' });
  }
};