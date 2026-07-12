import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { 
  getAuditCycles, getAuditCycleDetails, createAuditCycle, 
  submitAuditRecord, closeAuditCycle 
} from '../controllers/auditController';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const router = Router();
router.use(requireAuth); // All routes require login

router.get('/', getAuditCycles);
router.get('/:audit_cycle_id/assets', getAuditCycleDetails); // New endpoint
router.post('/', createAuditCycle);
router.post('/record', submitAuditRecord);
router.put('/:audit_cycle_id/close', closeAuditCycle);

export default router;