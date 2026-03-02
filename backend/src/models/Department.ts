import { executeQuery } from '../config/database';
import { Department, Position } from '../types';

export class DepartmentModel {
  // Get all departments
  static async getAll(): Promise<Department[]> {
    const query = `
      SELECT d.*, e.first_name as manager_first_name, e.last_name as manager_last_name 
      FROM departments d 
      LEFT JOIN employees e ON d.manager_id = e.id 
      WHERE d.is_active = TRUE 
      ORDER BY d.name
    `;
    return await executeQuery(query);
  }

  // Get department by ID
  static async getById(id: number): Promise<Department | null> {
    const query = `
      SELECT d.*, e.first_name as manager_first_name, e.last_name as manager_last_name 
      FROM departments d 
      LEFT JOIN employees e ON d.manager_id = e.id 
      WHERE d.id = ?
    `;
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  // Create new department
  static async create(departmentData: Partial<Department>): Promise<Department> {
    const query = `
      INSERT INTO departments (name, description, manager_id) 
      VALUES (?, ?, ?)
    `;
    
    const params = [
      departmentData.name,
      departmentData.description || null,
      departmentData.managerId || null
    ];

    const result = await executeQuery(query, params);
    const departmentId = result.insertId;
    
    return await this.getById(departmentId) as Department;
  }

  // Update department
  static async update(id: number, departmentData: Partial<Department>): Promise<Department | null> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.keys(departmentData).forEach(key => {
      if (departmentData[key as keyof Department] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(departmentData[key as keyof Department]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE departments SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await executeQuery(query, params);
    return await this.getById(id);
  }

  // Delete department (soft delete)
  static async delete(id: number): Promise<boolean> {
    const query = `UPDATE departments SET is_active = FALSE WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Get department with employee count
  static async getDepartmentStats(): Promise<any[]> {
    const query = `
      SELECT d.*, COUNT(e.id) as employee_count 
      FROM departments d 
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active'
      WHERE d.is_active = TRUE 
      GROUP BY d.id 
      ORDER BY d.name
    `;
    return await executeQuery(query);
  }
}

export class PositionModel {
  // Get all positions
  static async getAll(): Promise<Position[]> {
    const query = `
      SELECT p.*, d.name as department_name 
      FROM positions p 
      LEFT JOIN departments d ON p.department_id = d.id 
      WHERE p.is_active = TRUE 
      ORDER BY d.name, p.title
    `;
    return await executeQuery(query);
  }

  // Get position by ID
  static async getById(id: number): Promise<Position | null> {
    const query = `
      SELECT p.*, d.name as department_name 
      FROM positions p 
      LEFT JOIN departments d ON p.department_id = d.id 
      WHERE p.id = ?
    `;
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  // Get positions by department
  static async getByDepartment(departmentId: number): Promise<Position[]> {
    const query = `
      SELECT * FROM positions 
      WHERE department_id = ? AND is_active = TRUE 
      ORDER BY title
    `;
    return await executeQuery(query, [departmentId]);
  }

  // Create new position
  static async create(positionData: Partial<Position>): Promise<Position> {
    const query = `
      INSERT INTO positions (title, description, department_id, salary_range) 
      VALUES (?, ?, ?, ?)
    `;
    
    const params = [
      positionData.title,
      positionData.description || null,
      positionData.departmentId,
      positionData.salaryRange || null
    ];

    const result = await executeQuery(query, params);
    const positionId = result.insertId;
    
    return await this.getById(positionId) as Position;
  }

  // Update position
  static async update(id: number, positionData: Partial<Position>): Promise<Position | null> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.keys(positionData).forEach(key => {
      if (positionData[key as keyof Position] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(positionData[key as keyof Position]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE positions SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await executeQuery(query, params);
    return await this.getById(id);
  }

  // Delete position (soft delete)
  static async delete(id: number): Promise<boolean> {
    const query = `UPDATE positions SET is_active = FALSE WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Get position with employee count
  static async getPositionStats(): Promise<any[]> {
    const query = `
      SELECT p.*, d.name as department_name, COUNT(e.id) as employee_count 
      FROM positions p 
      LEFT JOIN departments d ON p.department_id = d.id 
      LEFT JOIN employees e ON p.id = e.position_id AND e.status = 'active'
      WHERE p.is_active = TRUE 
      GROUP BY p.id 
      ORDER BY d.name, p.title
    `;
    return await executeQuery(query);
  }
}