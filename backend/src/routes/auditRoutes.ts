import { Router } from 'express';
import { getAuditCycles, createAuditCycle, submitAuditRecord, closeAuditCycle, getActiveAuditDashboard, updateAssetVerification } from '../controllers/auditController';
import { requireAdmin } from '../middlewares/roleGuard';
// import updateAssetVerification from '../controllers/auditController';

const router = Router();
router.get('/', getAuditCycles);
router.post('/', requireAdmin, createAuditCycle);
router.post('/record', submitAuditRecord); // Auditors use this
router.put('/:audit_cycle_id/close', requireAdmin, closeAuditCycle);

router.get('/:id', getActiveAuditDashboard);

// POST /api/audit/:id/close -> Closes the cycle
router.patch('/:id/asset', updateAssetVerification);

router.post('/:id/close', closeAuditCycle);
export default router;