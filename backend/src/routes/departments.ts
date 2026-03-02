import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getPositions,
  getPositionById,
  getPositionsByDepartment,
  createPosition,
  updatePosition,
  deletePosition,
  getPositionStats,
  departmentValidation,
  positionValidation
} from '../controllers/departmentController';
import { authenticate, hrOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Department routes
router.get('/departments', getDepartments);
router.get('/departments/stats', hrOrAdmin, getDepartmentStats);
router.get('/departments/:id', getDepartmentById);
router.post('/departments', hrOrAdmin, departmentValidation, createDepartment);
router.put('/departments/:id', hrOrAdmin, departmentValidation, updateDepartment);
router.delete('/departments/:id', hrOrAdmin, deleteDepartment);

// Position routes
router.get('/positions', getPositions);
router.get('/positions/stats', hrOrAdmin, getPositionStats);
router.get('/positions/:id', getPositionById);
router.get('/departments/:departmentId/positions', getPositionsByDepartment);
router.post('/positions', hrOrAdmin, positionValidation, createPosition);
router.put('/positions/:id', hrOrAdmin, positionValidation, updatePosition);
router.delete('/positions/:id', hrOrAdmin, deletePosition);

export default router;