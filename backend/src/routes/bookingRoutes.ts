import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getSharedResources, getResourceBookings, createBooking } from '../controllers/bookingController';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

// Basic auth middleware for all roles
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const router = Router();

router.use(requireAuth);
router.get('/resources', getSharedResources);
router.get('/:asset_id', getResourceBookings);
router.post('/', createBooking);

export default router;