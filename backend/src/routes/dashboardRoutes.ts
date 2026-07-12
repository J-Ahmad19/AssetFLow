import { Router } from 'express';
import { getDashboardKPIs } from '../controllers/dashboardController';
// Note: In production, import your JWT middleware (e.g., verifyToken) to protect this route

const router = Router();

// Apply auth middleware here to ensure only logged-in users access the dashboard
router.get('/kpis', getDashboardKPIs);

export default router;