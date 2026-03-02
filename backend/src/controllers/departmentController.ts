import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DepartmentModel, PositionModel } from '../models/Department';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError 
} from '../utils/responseHelper';
import { AuthenticatedRequest } from '../types';

// Validation rules for department
export const departmentValidation = [
  body('name').notEmpty().withMessage('Department name is required'),
  body('description').optional().isString(),
  body('managerId').optional().isInt({ min: 1 }).withMessage('Valid manager ID is required')
];

// Validation rules for position
export const positionValidation = [
  body('title').notEmpty().withMessage('Position title is required'),
  body('description').optional().isString(),
  body('departmentId').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('salaryRange').optional().isString()
];

// Department Controllers
export const getDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await DepartmentModel.getAll();
    sendSuccess(res, departments, 'Departments retrieved successfully');
  } catch (error) {
    console.error('Error getting departments:', error);
    sendError(res, 'Failed to retrieve departments', 500);
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department = await DepartmentModel.getById(parseInt(id));

    if (!department) {
      sendError(res, 'Department not found', 404);
      return;
    }

    sendSuccess(res, department, 'Department retrieved successfully');
  } catch (error) {
    console.error('Error getting department:', error);
    sendError(res, 'Failed to retrieve department', 500);
  }
};

export const createDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const departmentData = req.body;
    const newDepartment = await DepartmentModel.create(departmentData);
    sendSuccess(res, newDepartment, 'Department created successfully', 201);
  } catch (error) {
    console.error('Error creating department:', error);
    sendError(res, 'Failed to create department', 500);
  }
};

export const updateDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const department = await DepartmentModel.getById(parseInt(id));
    if (!department) {
      sendError(res, 'Department not found', 404);
      return;
    }

    const updatedDepartment = await DepartmentModel.update(parseInt(id), updateData);
    sendSuccess(res, updatedDepartment, 'Department updated successfully');
  } catch (error) {
    console.error('Error updating department:', error);
    sendError(res, 'Failed to update department', 500);
  }
};

export const deleteDepartment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.getById(parseInt(id));
    if (!department) {
      sendError(res, 'Department not found', 404);
      return;
    }

    const success = await DepartmentModel.delete(parseInt(id));
    if (success) {
      sendSuccess(res, null, 'Department deleted successfully');
    } else {
      sendError(res, 'Failed to delete department', 500);
    }
  } catch (error) {
    console.error('Error deleting department:', error);
    sendError(res, 'Failed to delete department', 500);
  }
};

export const getDepartmentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await DepartmentModel.getDepartmentStats();
    sendSuccess(res, stats, 'Department statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting department stats:', error);
    sendError(res, 'Failed to retrieve department statistics', 500);
  }
};

// Position Controllers
export const getPositions = async (req: Request, res: Response): Promise<void> => {
  try {
    const positions = await PositionModel.getAll();
    sendSuccess(res, positions, 'Positions retrieved successfully');
  } catch (error) {
    console.error('Error getting positions:', error);
    sendError(res, 'Failed to retrieve positions', 500);
  }
};

export const getPositionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const position = await PositionModel.getById(parseInt(id));

    if (!position) {
      sendError(res, 'Position not found', 404);
      return;
    }

    sendSuccess(res, position, 'Position retrieved successfully');
  } catch (error) {
    console.error('Error getting position:', error);
    sendError(res, 'Failed to retrieve position', 500);
  }
};

export const getPositionsByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const positions = await PositionModel.getByDepartment(parseInt(departmentId));
    sendSuccess(res, positions, 'Positions retrieved successfully');
  } catch (error) {
    console.error('Error getting positions by department:', error);
    sendError(res, 'Failed to retrieve positions', 500);
  }
};

export const createPosition = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const positionData = req.body;
    const newPosition = await PositionModel.create(positionData);
    sendSuccess(res, newPosition, 'Position created successfully', 201);
  } catch (error) {
    console.error('Error creating position:', error);
    sendError(res, 'Failed to create position', 500);
  }
};

export const updatePosition = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const position = await PositionModel.getById(parseInt(id));
    if (!position) {
      sendError(res, 'Position not found', 404);
      return;
    }

    const updatedPosition = await PositionModel.update(parseInt(id), updateData);
    sendSuccess(res, updatedPosition, 'Position updated successfully');
  } catch (error) {
    console.error('Error updating position:', error);
    sendError(res, 'Failed to update position', 500);
  }
};

export const deletePosition = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const position = await PositionModel.getById(parseInt(id));
    if (!position) {
      sendError(res, 'Position not found', 404);
      return;
    }

    const success = await PositionModel.delete(parseInt(id));
    if (success) {
      sendSuccess(res, null, 'Position deleted successfully');
    } else {
      sendError(res, 'Failed to delete position', 500);
    }
  } catch (error) {
    console.error('Error deleting position:', error);
    sendError(res, 'Failed to delete position', 500);
  }
};

export const getPositionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await PositionModel.getPositionStats();
    sendSuccess(res, stats, 'Position statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting position stats:', error);
    sendError(res, 'Failed to retrieve position statistics', 500);
  }
};