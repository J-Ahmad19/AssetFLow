import { Request, Response } from 'express';
import db from '../config/db';

export const getSharedResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await db.getConnection();
    // Only fetch assets flagged as bookable shared resources[cite: 5]
    const [resources] = await connection.query(`
      SELECT asset_id, asset_tag, name 
      FROM assets 
      WHERE is_shared_resource = TRUE AND lifecycle_status != 'Retired' AND lifecycle_status != 'Disposed'
    `);
    connection.release();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared resources.' });
  }
};

export const getResourceBookings = async (req: Request, res: Response): Promise<void> => {
  const { asset_id } = req.params;
  try {
    const connection = await db.getConnection();
    const [bookings] = await connection.query(`
      SELECT b.booking_id, b.start_time, b.end_time, b.status, u.name as user_name
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      WHERE b.asset_id = ? AND b.status != 'Cancelled'
      ORDER BY b.start_time ASC
    `, [asset_id]);
    connection.release();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource schedule.' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const { asset_id, start_time, end_time } = req.body;
  // Using the user_id extracted from the JWT token
  const user_id = (req as any).user.userId;

  if (!asset_id || !start_time || !end_time) {
    res.status(400).json({ error: 'Asset, start time, and end time are required.' });
    return;
  }

  if (new Date(start_time) >= new Date(end_time)) {
    res.status(400).json({ error: 'End time must be after start time.' });
    return;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction(); // ACID: Start Transaction

    // Overlap Validation Query[cite: 5]
    const [overlapCheck]: any = await connection.query(`
      SELECT COUNT(*) as count 
      FROM bookings 
      WHERE asset_id = ? 
      AND status != 'Cancelled' 
      AND start_time < ? 
      AND end_time > ?
    `, [asset_id, end_time, start_time]); // Passing new_end and new_start[cite: 5]

    // If count > 0, reject with overlap error[cite: 5]
    if (overlapCheck[0].count > 0) {
      await connection.rollback();
      res.status(409).json({ error: 'Conflict - requested slot overlaps with an existing booking.' });
      return;
    }

    // If 0, save as 'Upcoming'[cite: 5]
    await connection.query(`
      INSERT INTO bookings (asset_id, user_id, start_time, end_time, status) 
      VALUES (?, ?, ?, ?, 'Upcoming')
    `, [asset_id, user_id, start_time, end_time]);

    await connection.commit(); // ACID: Commit
    res.status(201).json({ message: 'Resource booked successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('[Booking API]', error);
    res.status(500).json({ error: 'Database error during booking.' });
  } finally {
    connection.release();
  }
};