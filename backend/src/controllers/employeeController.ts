import { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { EmployeeModel } from '../models/Employee';
import { 
  sendSuccess, 
  sendError, 
  sendPaginatedResponse, 
  sendValidationError 
} from '../utils/responseHelper';
import { 
  AuthenticatedRequest, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest, 
  EmployeeQueryParams 
} from '../types';

// Validation rules for creating employee
export const createEmployeeValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('hireDate').isISO8601().withMessage('Valid hire date is required'),
  body('departmentId').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('positionId').isInt({ min: 1 }).withMessage('Valid position ID is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Valid salary is required'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required')
];

// Validation rules for updating employee
export const updateEmployeeValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('hireDate').optional().isISO8601().withMessage('Valid hire date is required'),
  body('departmentId').optional().isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('positionId').optional().isInt({ min: 1 }).withMessage('Valid position ID is required'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Valid salary is required'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('status').optional().isIn(['active', 'inactive', 'terminated']).withMessage('Valid status is required')
];

// Query validation for employee list
export const employeeQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 10000 }).withMessage('Limit must be between 1 and 10000'),
  query('sortBy').optional().isIn(['first_name', 'last_name', 'email', 'hire_date', 'created_at']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
];

// Get all employees
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const queryParams: EmployeeQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string || '',
      department: req.query.department as string || '',
      position: req.query.position as string || '',
      status: req.query.status as string || '',
      sortBy: req.query.sortBy as string || 'created_at',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const { employees, total } = await EmployeeModel.getAll(queryParams);

    sendPaginatedResponse(
      res,
      employees,
      queryParams.page!,
      total,
      queryParams.limit!,
      'Employees retrieved successfully'
    );
  } catch (error) {
    console.error('Error getting employees:', error);
    sendError(res, 'Failed to retrieve employees', 500);
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.getById(parseInt(id));

    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    sendSuccess(res, employee, 'Employee retrieved successfully');
  } catch (error) {
    console.error('Error getting employee:', error);
    sendError(res, 'Failed to retrieve employee', 500);
  }
};

// Create new employee
export const createEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const employeeData: CreateEmployeeRequest = req.body;

    // Check if employee ID already exists
    const existingEmployee = await EmployeeModel.getByEmployeeId(employeeData.employeeId);
    if (existingEmployee) {
      sendError(res, 'Employee ID already exists', 400);
      return;
    }

    const newEmployee = await EmployeeModel.create(employeeData);
    sendSuccess(res, newEmployee, 'Employee created successfully', 201);
  } catch (error) {
    console.error('Error creating employee:', error);
    sendError(res, 'Failed to create employee', 500);
  }
};

// Update employee
export const updateEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { id } = req.params;
    const updateData: UpdateEmployeeRequest = req.body;

    const employee = await EmployeeModel.getById(parseInt(id));
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const updatedEmployee = await EmployeeModel.update(parseInt(id), updateData);
    sendSuccess(res, updatedEmployee, 'Employee updated successfully');
  } catch (error) {
    console.error('Error updating employee:', error);
    sendError(res, 'Failed to update employee', 500);
  }
};

// Delete employee (soft delete)
export const deleteEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.getById(parseInt(id));
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    const success = await EmployeeModel.delete(parseInt(id));
    if (success) {
      sendSuccess(res, null, 'Employee deleted successfully');
    } else {
      sendError(res, 'Failed to delete employee', 500);
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    sendError(res, 'Failed to delete employee', 500);
  }
};

// Get employees by department
export const getEmployeesByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const employees = await EmployeeModel.getByDepartment(parseInt(departmentId));
    sendSuccess(res, employees, 'Employees retrieved successfully');
  } catch (error) {
    console.error('Error getting employees by department:', error);
    sendError(res, 'Failed to retrieve employees', 500);
  }
};

// Get employee statistics
export const getEmployeeStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const statistics = await EmployeeModel.getStatistics();
    sendSuccess(res, statistics, 'Employee statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting employee statistics:', error);
    sendError(res, 'Failed to retrieve employee statistics', 500);
  }
};