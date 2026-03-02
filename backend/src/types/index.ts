import { Request } from 'express';

// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'hr' | 'employee';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Employee related types
export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  departmentId: number;
  positionId: number;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  address?: string;
  profilePicture?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  salaryRange?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance related types
export interface Attendance {
  id: number;
  employeeId: number;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  workingHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Request body types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'hr' | 'employee';
}

export interface CreateEmployeeRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  hireDate: string;
  departmentId: number;
  positionId: number;
  salary: number;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: 'active' | 'inactive' | 'terminated';
}

// Query parameters
export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  position?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}