console.log("CONTROLLER FILE LOADED:", __filename);

const db = require('../config/db');

console.log("Resolved DB path:", require.resolve('../config/db'));
// Helper to map db row to the format frontend expects
const mapPlateToVehicle = (row) => {
  return {
    id: row.id,
    vehicleNumber: row.plate_text,
    entryTime: row.created_at,
    status: row.status || 'pending',
    type: 'visitor', // Default as per new requirement
    approvedBy: row.approved_by || null
  };
};

const baseQuery = `
  SELECT
    p.id,
    p.plate_text,
    p.created_at,
    COALESCE(a.status, 'pending') as status,
    a.approved_by
  FROM plates p
  LEFT JOIN approvals a ON p.id = a.plate_id
`;

// GET /api/vehicles/live
const getLiveVehicles = async (req, res) => {
  try {
    const result = await db.query(`
      ${baseQuery}
      WHERE COALESCE(a.status, 'pending') = 'pending'
      ORDER BY p.created_at DESC
    `);

    // Map data
    const liveVehicles = result.rows.map(mapPlateToVehicle);
    res.json(liveVehicles);
  } catch (error) {
    console.error('Error fetching live vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/vehicles/all
const getAllVehicles = async (req, res) => {
  try {
    const result = await db.query(`
      ${baseQuery}
      ORDER BY p.created_at DESC
    `);

    const allVehicles = result.rows.map(mapPlateToVehicle);
    res.json(allVehicles);
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/vehicles/:id/approve
const approveVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const approved_by = req.user ? req.user.name : 'Unknown';

    // Verify plate exists first to avoid invalid foreign keys
    const plateCheck = await db.query("SELECT id FROM plates WHERE id = $1", [id]);
    if (plateCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plate not found' });
    }

    // Insert or update approval
    const approvalCheck = await db.query("SELECT id FROM approvals WHERE plate_id = $1", [id]);

    if (approvalCheck.rows.length > 0) {
      await db.query(
        "UPDATE approvals SET status = 'approved', approved_by = $1, updated_at = CURRENT_TIMESTAMP WHERE plate_id = $2",
        [approved_by, id]
      );
    } else {
      await db.query(
        "INSERT INTO approvals (plate_id, status, approved_by) VALUES ($1, 'approved', $2)",
        [id, approved_by]
      );
    }

    // Fetch the updated entry
    const updatedResult = await db.query(`
      ${baseQuery}
      WHERE p.id = $1
    `, [id]);

    const updatedVehicle = mapPlateToVehicle(updatedResult.rows[0]);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('vehicleUpdated', updatedVehicle);
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error approving vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/vehicles/:id/reject
const rejectVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify plate exists first to avoid invalid foreign keys
    const plateCheck = await db.query("SELECT id FROM plates WHERE id = $1", [id]);
    if (plateCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plate not found' });
    }

    // Insert or update approval
    const approvalCheck = await db.query("SELECT id FROM approvals WHERE plate_id = $1", [id]);

    if (approvalCheck.rows.length > 0) {
      await db.query(
        "UPDATE approvals SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE plate_id = $1",
        [id]
      );
    } else {
      await db.query(
        "INSERT INTO approvals (plate_id, status) VALUES ($1, 'rejected')",
        [id]
      );
    }

    // Fetch the updated entry
    const updatedResult = await db.query(`
      ${baseQuery}
      WHERE p.id = $1
    `, [id]);

    const updatedVehicle = mapPlateToVehicle(updatedResult.rows[0]);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('vehicleUpdated', updatedVehicle);
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error rejecting vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/vehicles/stats
const getStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN COALESCE(a.status, 'pending') = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN COALESCE(a.status, 'pending') = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN COALESCE(a.status, 'pending') = 'pending' THEN 1 ELSE 0 END) as pending
      FROM plates p
      LEFT JOIN approvals a ON p.id = a.plate_id
    `);

    // Convert counts from string to number since pg returns count as string
    const stats = {
      total: parseInt(result.rows[0].total) || 0,
      approved: parseInt(result.rows[0].approved) || 0,
      rejected: parseInt(result.rows[0].rejected) || 0,
      pending: parseInt(result.rows[0].pending) || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/vehicles/analytics
const getAnalytics = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        DATE(p.created_at) as date,
        COUNT(*) as count
      FROM plates p
      GROUP BY DATE(p.created_at)
      ORDER BY date ASC
    `);

    // Format date properly depending on pg response
    const analytics = result.rows.map(row => {
      // Create date without timezone shift
      const d = new Date(row.date);
      // formatting YYYY-MM-DD
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        count: parseInt(row.count) || 0
      };
    });

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/vehicles/add (From OCR Team)
const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.body; // Ignore incoming type directly

    if (!vehicleNumber) {
      return res.status(400).json({ error: 'vehicleNumber is required' });
    }

    const result = await db.query(
      "INSERT INTO plates (plate_text) VALUES ($1) ON CONFLICT (plate_text) DO UPDATE SET created_at = CURRENT_TIMESTAMP RETURNING *",
      [vehicleNumber]
    );

    const newPlate = result.rows[0];

    // Explicitly shape response in frontend format
    // Since this is newly added it does not have approvals row, map defaults directly.
    const newVehicle = mapPlateToVehicle({
      ...newPlate,
      status: 'pending',
      approved_by: null
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('newVehicle', newVehicle);
    }

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error adding new vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getLiveVehicles,
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getStats,
  getAnalytics,
  addVehicle
};
