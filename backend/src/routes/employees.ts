import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeeStatistics,
  createEmployeeValidation,
  updateEmployeeValidation,
  employeeQueryValidation
} from '../controllers/employeeController';
import { authenticate, hrOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get routes (all authenticated users can view)
router.get('/', employeeQueryValidation, getEmployees);
router.get('/statistics', hrOrAdmin, getEmployeeStatistics);
router.get('/department/:departmentId', getEmployeesByDepartment);
router.get('/:id', getEmployeeById);

// Create, Update, Delete routes (HR and Admin only)
router.post('/', hrOrAdmin, createEmployeeValidation, createEmployee);
router.put('/:id', hrOrAdmin, updateEmployeeValidation, updateEmployee);
router.delete('/:id', hrOrAdmin, deleteEmployee);

export default router;