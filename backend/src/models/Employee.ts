import { executeQuery } from '../config/database';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeQueryParams } from '../types';

export class EmployeeModel {
  // Get all employees with filtering and pagination
  static async getAll(params: EmployeeQueryParams = {}): Promise<{ employees: Employee[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        department = '',
        position = '',
        status = '',
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = params;

      const offset = (page - 1) * limit;
      
      // Validate sortBy field to prevent SQL injection
      const allowedSortFields = ['id', 'first_name', 'last_name', 'email', 'hire_date', 'created_at', 'updated_at'];
      const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

      let query = `
        SELECT e.*, d.name as department_name, p.title as position_title 
        FROM employees e 
        LEFT JOIN departments d ON e.department_id = d.id 
        LEFT JOIN positions p ON e.position_id = p.id 
        WHERE 1=1
      `;
      
      const queryParams: any[] = [];

      // Add search filter
      if (search && search.trim() !== '') {
        query += ` AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR e.employee_id LIKE ?)`;
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Add department filter
      if (department && department.trim() !== '') {
        query += ` AND e.department_id = ?`;
        queryParams.push(parseInt(department));
      }

      // Add position filter
      if (position && position.trim() !== '') {
        query += ` AND e.position_id = ?`;
        queryParams.push(parseInt(position));
      }

      // Add status filter
      if (status && status.trim() !== '') {
        query += ` AND e.status = ?`;
        queryParams.push(status);
      }

      // Count total records first
      const countQuery = query.replace(
        'SELECT e.*, d.name as department_name, p.title as position_title',
        'SELECT COUNT(*) as total'
      );
      const countResult = await executeQuery(countQuery, queryParams);
      const total = countResult[0].total;

      // Add sorting and pagination using template literals (safe because we validated sortBy)
      const finalQuery = `${query} ORDER BY e.${validSortBy} ${validSortOrder} LIMIT ${limit} OFFSET ${offset}`;
      
      console.log('Final query:', finalQuery);
      console.log('Query params for final query:', queryParams);

      const employees = await executeQuery(finalQuery, queryParams);
      return { employees, total };
    } catch (error) {
      console.error('Error in Employee.getAll:', error);
      throw error;
    }
  }

  // Get employee by ID
  static async getById(id: number): Promise<Employee | null> {
    const query = `
      SELECT e.*, d.name as department_name, p.title as position_title 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id 
      LEFT JOIN positions p ON e.position_id = p.id 
      WHERE e.id = ?
    `;
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  // Get employee by employee ID
  static async getByEmployeeId(employeeId: string): Promise<Employee | null> {
    const query = `
      SELECT e.*, d.name as department_name, p.title as position_title 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id 
      LEFT JOIN positions p ON e.position_id = p.id 
      WHERE e.employee_id = ?
    `;
    const result = await executeQuery(query, [employeeId]);
    return result.length > 0 ? result[0] : null;
  }

  // Create new employee
  static async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    const query = `
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone_number, 
        date_of_birth, hire_date, department_id, position_id, salary, 
        address, emergency_contact, emergency_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      employeeData.employeeId,
      employeeData.firstName,
      employeeData.lastName,
      employeeData.email,
      employeeData.phoneNumber || null,
      employeeData.dateOfBirth || null,
      employeeData.hireDate,
      employeeData.departmentId,
      employeeData.positionId,
      employeeData.salary,
      employeeData.address || null,
      employeeData.emergencyContact || null,
      employeeData.emergencyPhone || null
    ];

    const result = await executeQuery(query, params);
    const employeeId = result.insertId;
    
    return await this.getById(employeeId) as Employee;
  }

  // Update employee
  static async update(id: number, employeeData: UpdateEmployeeRequest): Promise<Employee | null> {
    const fields: string[] = [];
    const params: any[] = [];

    // Build dynamic update query
    Object.keys(employeeData).forEach(key => {
      if (employeeData[key as keyof UpdateEmployeeRequest] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(employeeData[key as keyof UpdateEmployeeRequest]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await executeQuery(query, params);
    return await this.getById(id);
  }

  // Delete employee (soft delete by setting status to terminated)
  static async delete(id: number): Promise<boolean> {
    const query = `UPDATE employees SET status = 'terminated' WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Hard delete employee
  static async hardDelete(id: number): Promise<boolean> {
    const query = `DELETE FROM employees WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Get employees by department
  static async getByDepartment(departmentId: number): Promise<Employee[]> {
    const query = `
      SELECT e.*, d.name as department_name, p.title as position_title 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id 
      LEFT JOIN positions p ON e.position_id = p.id 
      WHERE e.department_id = ? AND e.status = 'active'
    `;
    return await executeQuery(query, [departmentId]);
  }

  // Get employee statistics
  static async getStatistics(): Promise<any> {
    const queries = [
      'SELECT COUNT(*) as total FROM employees WHERE status = "active"',
      'SELECT COUNT(*) as total FROM employees WHERE status = "inactive"',
      'SELECT COUNT(*) as total FROM employees WHERE status = "terminated"',
      'SELECT d.name, COUNT(*) as count FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.status = "active" GROUP BY d.id',
    ];

    const [active, inactive, terminated, byDepartment] = await Promise.all(
      queries.map(query => executeQuery(query))
    );

    return {
      totalActive: active[0].total,
      totalInactive: inactive[0].total,
      totalTerminated: terminated[0].total,
      byDepartment
    };
  }
}