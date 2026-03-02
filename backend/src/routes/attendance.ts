import { Router } from 'express';
import {
  getAttendance,
  getAttendanceByEmployee,
  getAttendanceByDate,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  markAbsent,
  getAttendanceStatistics,
  getMonthlyAttendance,
  getCurrentAttendanceStatus,
  attendanceQueryValidation,
  checkInValidation,
  checkOutValidation,
  markAbsentValidation
} from '../controllers/attendanceController';
import { authenticate, hrOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get routes
router.get('/', hrOrAdmin, attendanceQueryValidation, getAttendance);
router.get('/statistics', hrOrAdmin, getAttendanceStatistics);
router.get('/date/:date', hrOrAdmin, getAttendanceByDate);
router.get('/employee/:employeeId', getAttendanceByEmployee);
router.get('/employee/:employeeId/monthly', getMonthlyAttendance);
router.get('/employee/:employeeId/status', getCurrentAttendanceStatus);

// Action routes
router.post('/checkin', checkInValidation, checkIn);
router.post('/checkout', checkOutValidation, checkOut);
router.post('/break/start', startBreak);
router.post('/break/end', endBreak);
router.post('/absent', hrOrAdmin, markAbsentValidation, markAbsent);

export default router;