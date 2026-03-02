import { executeQuery } from '../config/database';
import { User, LoginRequest, RegisterRequest } from '../types';
import bcrypt from 'bcryptjs';

export class UserModel {
  // Get user by email
  static async getByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await executeQuery(query, [email]);
    if (result.length > 0) {
      const user = result[0];
      // Map database fields to TypeScript interface
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        isActive: Boolean(user.is_active),
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    }
    return null;
  }

  // Get user by ID
  static async getById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await executeQuery(query, [id]);
    if (result.length > 0) {
      const user = result[0];
      // Map database fields to TypeScript interface
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        isActive: Boolean(user.is_active),
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    }
    return null;
  }

  // Get user by username
  static async getByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = ?';
    const result = await executeQuery(query, [username]);
    return result.length > 0 ? result[0] : null;
  }

  // Create new user
  static async create(userData: RegisterRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, first_name, last_name, role) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      userData.username,
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.role || 'employee'
    ];

    const result = await executeQuery(query, params);
    const userId = result.insertId;
    
    return await this.getById(userId) as User;
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Update user
  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.keys(userData).forEach(key => {
      if (userData[key as keyof User] !== undefined && key !== 'id' && key !== 'password') {
        fields.push(`${key} = ?`);
        params.push(userData[key as keyof User]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await executeQuery(query, params);
    return await this.getById(id);
  }

  // Update password
  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const result = await executeQuery(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Deactivate user
  static async deactivate(id: number): Promise<boolean> {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Activate user
  static async activate(id: number): Promise<boolean> {
    const query = 'UPDATE users SET is_active = TRUE WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Get all users
  static async getAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    return await executeQuery(query);
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }
}