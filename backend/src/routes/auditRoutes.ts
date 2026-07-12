import { Router } from 'express';
import { getAuditCycles, createAuditCycle, submitAuditRecord, closeAuditCycle } from '../controllers/auditController';
import { requireAdmin } from '../middlewares/roleGuard';
// import { getActiveAuditDashboard, updateAssetVerification } from '../controllers/authController';

const router = Router();
router.get('/', getAuditCycles);
router.post('/', requireAdmin, createAuditCycle);
router.post('/record', submitAuditRecord); // Auditors use this
router.put('/:audit_cycle_id/close', requireAdmin, closeAuditCycle);

// this is new added by farhan
// GET /api/audit/:id -> Fetches the screen data
// router.get('/:id', getActiveAuditDashboard);

// PATCH /api/audit/:id/asset -> Updates status badge (Verified/Missing/Damaged)
// router.patch('/:id/asset', updateAssetVerification);

// POST /api/audit/:id/close -> Closes the cycle
// router.post('/:id/close', closeAuditCycle);
export default router;