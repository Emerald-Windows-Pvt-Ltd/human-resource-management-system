import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

// Success response helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  return res.status(statusCode).json(response);
};

// Error response helper
export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error
  };
  return res.status(statusCode).json(response);
};

// Paginated response helper
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
  message: string = 'Success'
): Response => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage
    }
  };
  return res.status(200).json(response);
};

// Validation error response helper
export const sendValidationError = (
  res: Response,
  errors: any[],
  message: string = 'Validation failed'
): Response => {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
};