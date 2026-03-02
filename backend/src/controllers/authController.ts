import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { generateToken } from '../middleware/auth';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError 
} from '../utils/responseHelper';
import { 
  AuthenticatedRequest, 
  LoginRequest, 
  RegisterRequest 
} from '../types';

// Validation rules for login
export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation rules for registration
export const registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'hr', 'employee']).withMessage('Invalid role')
];

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await UserModel.getByEmail(email);
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      sendError(res, 'Account is deactivated', 401);
      return;
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, {
      user: userWithoutPassword,
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    sendError(res, 'Login failed', 500);
  }
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array());
      return;
    }

    const userData: RegisterRequest = req.body;

    // Check if user already exists
    const existingUserByEmail = await UserModel.getByEmail(userData.email);
    if (existingUserByEmail) {
      sendError(res, 'Email already registered', 400);
      return;
    }

    const existingUserByUsername = await UserModel.getByUsername(userData.username);
    if (existingUserByUsername) {
      sendError(res, 'Username already taken', 400);
      return;
    }

    // Create new user
    const newUser = await UserModel.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    sendSuccess(res, {
      user: userWithoutPassword,
      token
    }, 'Registration successful', 201);
  } catch (error) {
    console.error('Error during registration:', error);
    sendError(res, 'Registration failed', 500);
  }
};

// Get current user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401);
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user;

    sendSuccess(res, userWithoutPassword, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Error getting profile:', error);
    sendError(res, 'Failed to retrieve profile', 500);
  }
};

// Update user profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401);
      return;
    }

    const { firstName, lastName, phoneNumber } = req.body;
    
    const updateData = {
      firstName,
      lastName,
      phoneNumber
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const updatedUser = await UserModel.update(req.user.id, updateData);

    if (!updatedUser) {
      sendError(res, 'Failed to update profile', 500);
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    sendSuccess(res, userWithoutPassword, 'Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

// Change password
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401);
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendError(res, 'Current password and new password are required', 400);
      return;
    }

    if (newPassword.length < 6) {
      sendError(res, 'New password must be at least 6 characters long', 400);
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await UserModel.verifyPassword(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
      sendError(res, 'Current password is incorrect', 400);
      return;
    }

    // Update password
    const success = await UserModel.updatePassword(req.user.id, newPassword);
    
    if (success) {
      sendSuccess(res, null, 'Password changed successfully');
    } else {
      sendError(res, 'Failed to change password', 500);
    }
  } catch (error) {
    console.error('Error changing password:', error);
    sendError(res, 'Failed to change password', 500);
  }
};

// Logout (client-side token removal, server doesn't store tokens)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    sendError(res, 'Logout failed', 500);
  }
};