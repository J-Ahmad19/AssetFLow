import db from '../config/db.js'; // Assuming standard mysql2/promise pool

// Fetch all maintenance requests with associated asset details
export const getMaintenanceRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.request_id, 
        m.status, 
        m.issue_description,
        a.asset_tag, 
        a.name as asset_name
      FROM maintenance_requests m
      JOIN assets a ON m.asset_id = a.asset_id
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ message: 'Server error retrieving requests' });
  }
};

// Update status and auto-update asset lifecycle
export const updateMaintenanceStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Update the maintenance request status
    await connection.query(
      'UPDATE maintenance_requests SET status = ? WHERE request_id = ?',
      [newStatus, id]
    );

    // 2. Fetch the associated asset_id
    const [requestRows] = await connection.query(
      'SELECT asset_id FROM maintenance_requests WHERE request_id = ?',
      [id]
    );
    const assetId = requestRows[0].asset_id;

    // 3. Auto-update Asset Lifecycle Status based on workflow rules
    if (newStatus === 'Approved') {
      // Moves asset to 'Under Maintenance'[cite: 11]
      await connection.query(
        'UPDATE assets SET lifecycle_status = ? WHERE asset_id = ?',
        ['Under Maintenance', assetId]
      );
    } else if (newStatus === 'Resolved') {
      // Reverts asset to 'Available'[cite: 11]
      await connection.query(
        'UPDATE assets SET lifecycle_status = ? WHERE asset_id = ?',
        ['Available', assetId]
      );
    }

    await connection.commit();
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating maintenance status:', error);
    res.status(500).json({ message: 'Transaction failed' });
  } finally {
    connection.release();
  }
};