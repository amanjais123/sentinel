const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

// Public/System route for OCR
router.post('/add', vehicleController.addVehicle);

// Protected routes inside this middleware
router.use(authMiddleware);

// Get live (pending) vehicles
router.get('/live', vehicleController.getLiveVehicles);

// Get all vehicles
router.get('/all', vehicleController.getAllVehicles);

// Approve a vehicle
router.post('/:id/approve', vehicleController.approveVehicle);

// Reject a vehicle
router.post('/:id/reject', vehicleController.rejectVehicle);

// Get statistics
router.get('/stats', vehicleController.getStats);

// Get daily analytics
router.get('/analytics', vehicleController.getAnalytics);

module.exports = router;
