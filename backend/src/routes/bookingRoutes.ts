// backend/src/routes/bookingRoutes.ts
import { Router } from 'express';
import { createBooking, getBookings } from '../controllers/bookingController';

const router = Router();

// Retrieve directory data for bookings
router.get('/', getBookings);

// Core booking creation workflow
router.post('/', createBooking);

export default router;