import express from 'express';
import { getMaintenanceRequests, updateMaintenanceStatus } from '../controllers/maintenanceController.js';

const router = express.Router();

// GET /api/maintenance
router.get('/', getMaintenanceRequests);

// PUT /api/maintenance/:id/status
router.put('/:id/status', updateMaintenanceStatus);

export default router;