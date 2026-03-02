import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { AttendanceModel } from '../models/Attendance';
import { EmployeeModel } from '../models/Employee';
import { 
  sendSuccess, 
  sendError, 
  sendPaginatedResponse,
  sendValidationError 
} from '../utils/responseHelper';
import { AuthenticatedRequest } from '../types';

// Validation rules
export const attendanceQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required')
];

export const checkInValidation = [
  body('employeeId').isInt({ min: 1 }).withMessage('Valid employee ID is required'),
  body('checkInTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Valid time format required (HH:MM:SS)')
];

export const checkOutValidation = [
  body('employeeId').isInt({ min: 1 }).withMessage('Valid employee ID is required'),
  body('checkOutTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Valid time format required (HH:MM:SS)')
];

export const markAbsentValidation = [
  body('employeeId').isInt({ min: 1 }).withMessage('Valid employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('notes').optional().isString()
];

// Get all attendance records
export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const { attendance, total } = await AttendanceModel.getAll(page, limit, startDate, endDate);

    sendPaginatedResponse(
      res,
      attendance,
      page,
      total,
      limit,
      'Attendance records retrieved successfully'
    );
  } catch (error) {
    console.error('Error getting attendance:', error);
    sendError(res, 'Failed to retrieve attendance records', 500);
  }
};

// Get attendance by employee and date range
export const getAttendanceByEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const startDate = req.query.startDate as string || new Date().toISOString().split('T')[0];
    const endDate = req.query.endDate as string || new Date().toISOString().split('T')[0];

    const attendance = await AttendanceModel.getByEmployeeAndDateRange(
      parseInt(employeeId),
      startDate,
      endDate
    );

    sendSuccess(res, attendance, 'Employee attendance retrieved successfully');
  } catch (error) {
    console.error('Error getting employee attendance:', error);
    sendError(res, 'Failed to retrieve employee attendance', 500);
  }
};

// Get attendance for a specific date
export const getAttendanceByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      sendError(res, 'Invalid date format. Use YYYY-MM-DD', 400);
      return;
    }

    const attendance = await AttendanceModel.getByDate(date);
    sendSuccess(res, attendance, 'Attendance for date retrieved successfully');
  } catch (error) {
    console.error('Error getting attendance by date:', error);
    sendError(res, 'Failed to retrieve attendance for date', 500);
  }
};

// Check in employee
export const checkIn = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { employeeId, checkInTime } = req.body;

    // Verify employee exists
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.checkIn(employeeId, checkInTime);
    sendSuccess(res, attendance, 'Check-in successful');
  } catch (error) {
    console.error('Error during check-in:', error);
    sendError(res, 'Check-in failed', 500);
  }
};

// Check out employee
export const checkOut = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { employeeId, checkOutTime } = req.body;

    // Verify employee exists
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.checkOut(employeeId, checkOutTime);
    sendSuccess(res, attendance, 'Check-out successful');
  } catch (error) {
    console.error('Error during check-out:', error);
    sendError(res, 'Check-out failed', 500);
  }
};

// Start break
export const startBreak = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, breakStartTime } = req.body;

    if (!employeeId) {
      sendError(res, 'Employee ID is required', 400);
      return;
    }

    // Verify employee exists
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.startBreak(employeeId, breakStartTime);
    sendSuccess(res, attendance, 'Break started successfully');
  } catch (error) {
    console.error('Error starting break:', error);
    sendError(res, 'Failed to start break', 500);
  }
};

// End break
export const endBreak = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, breakEndTime } = req.body;

    if (!employeeId) {
      sendError(res, 'Employee ID is required', 400);
      return;
    }

    // Verify employee exists
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.endBreak(employeeId, breakEndTime);
    sendSuccess(res, attendance, 'Break ended successfully');
  } catch (error) {
    console.error('Error ending break:', error);
    sendError(res, 'Failed to end break', 500);
  }
};

// Mark employee as absent
export const markAbsent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { employeeId, date, notes } = req.body;

    // Verify employee exists
    const employee = await EmployeeModel.getById(employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.markAbsent(employeeId, date, notes);
    sendSuccess(res, attendance, 'Employee marked as absent');
  } catch (error) {
    console.error('Error marking absent:', error);
    sendError(res, 'Failed to mark employee as absent', 500);
  }
};

// Get attendance statistics
export const getAttendanceStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = req.query.startDate as string || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = req.query.endDate as string || new Date().toISOString().split('T')[0];

    const statistics = await AttendanceModel.getStatistics(startDate, endDate);
    sendSuccess(res, statistics, 'Attendance statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting attendance statistics:', error);
    sendError(res, 'Failed to retrieve attendance statistics', 500);
  }
};

// Get monthly attendance for an employee
export const getMonthlyAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

    // Verify employee exists
    const employee = await EmployeeModel.getById(parseInt(employeeId));
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const monthlyAttendance = await AttendanceModel.getMonthlyAttendance(
      parseInt(employeeId),
      year,
      month
    );

    sendSuccess(res, monthlyAttendance, 'Monthly attendance retrieved successfully');
  } catch (error) {
    console.error('Error getting monthly attendance:', error);
    sendError(res, 'Failed to retrieve monthly attendance', 500);
  }
};

// Get current attendance status for an employee
export const getCurrentAttendanceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Verify employee exists
    const employee = await EmployeeModel.getById(parseInt(employeeId));
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const attendance = await AttendanceModel.getByEmployeeAndDate(parseInt(employeeId), today);
    
    if (!attendance) {
      sendSuccess(res, {
        hasCheckedIn: false,
        hasCheckedOut: false,
        isOnBreak: false,
        attendance: null
      }, 'No attendance record for today');
      return;
    }

    const hasCheckedIn = !!(attendance as any).check_in;
    const hasCheckedOut = !!(attendance as any).check_out;
    const isOnBreak = !!(attendance as any).break_start && !(attendance as any).break_end;

    sendSuccess(res, {
      hasCheckedIn,
      hasCheckedOut,
      isOnBreak,
      attendance
    }, 'Current attendance status retrieved successfully');
  } catch (error) {
    console.error('Error getting current attendance status:', error);
    sendError(res, 'Failed to retrieve current attendance status', 500);
  }
};