import { executeQuery } from '../config/database';
import { Attendance } from '../types';

export class AttendanceModel {
  // Get attendance by employee and date range
  static async getByEmployeeAndDateRange(
    employeeId: number, 
    startDate: string, 
    endDate: string
  ): Promise<Attendance[]> {
    const query = `
      SELECT a.*, e.first_name, e.last_name, e.employee_id 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      WHERE a.employee_id = ? AND a.date BETWEEN ? AND ? 
      ORDER BY a.date DESC
    `;
    return await executeQuery(query, [employeeId, startDate, endDate]);
  }

  // Get attendance by date
  static async getByDate(date: string): Promise<Attendance[]> {
    const query = `
      SELECT a.*, e.first_name, e.last_name, e.employee_id 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      WHERE a.date = ? 
      ORDER BY e.first_name, e.last_name
    `;
    return await executeQuery(query, [date]);
  }

  // Get attendance for all employees with pagination
  static async getAll(
    page: number = 1, 
    limit: number = 10, 
    startDate?: string, 
    endDate?: string
  ): Promise<{ attendance: Attendance[]; total: number }> {
    const offset = (page - 1) * limit;
    let query = `
      SELECT a.*, e.first_name, e.last_name, e.employee_id, d.name as department_name 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      JOIN departments d ON e.department_id = d.id 
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];

    if (startDate && endDate) {
      query += ` AND a.date BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    // Count total records
    const countQuery = query.replace(
      'SELECT a.*, e.first_name, e.last_name, e.employee_id, d.name as department_name',
      'SELECT COUNT(*) as total'
    );
    const countResult = await executeQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Add pagination
    query += ` ORDER BY a.date DESC, e.first_name LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const attendance = await executeQuery(query, queryParams);
    return { attendance, total };
  }

  // Check in employee
  static async checkIn(employeeId: number, checkInTime?: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = checkInTime || new Date().toTimeString().split(' ')[0];

    // Check if attendance record exists for today
    const existingQuery = `SELECT * FROM attendance WHERE employee_id = ? AND date = ?`;
    const existing = await executeQuery(existingQuery, [employeeId, today]);

    if (existing.length > 0) {
      // Update existing record
      const updateQuery = `UPDATE attendance SET check_in = ?, status = 'present' WHERE employee_id = ? AND date = ?`;
      await executeQuery(updateQuery, [currentTime, employeeId, today]);
    } else {
      // Create new record
      const insertQuery = `
        INSERT INTO attendance (employee_id, date, check_in, status) 
        VALUES (?, ?, ?, 'present')
      `;
      await executeQuery(insertQuery, [employeeId, today, currentTime]);
    }

    const result = await this.getByEmployeeAndDate(employeeId, today);
    if (!result) {
      throw new Error('Failed to retrieve attendance record');
    }
    return result;
  }

  // Check out employee
  static async checkOut(employeeId: number, checkOutTime?: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = checkOutTime || new Date().toTimeString().split(' ')[0];

    // Calculate working hours
    const attendanceRecord = await this.getByEmployeeAndDate(employeeId, today);
    if (!attendanceRecord) {
      throw new Error('No check-in record found for today');
    }

    let workingHours = 0;
    if ((attendanceRecord as any).check_in) {
      const checkIn = new Date(`${today}T${(attendanceRecord as any).check_in}`);
      const checkOut = new Date(`${today}T${currentTime}`);
      workingHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60); // Convert to hours
      
      // Subtract break time if exists
      if ((attendanceRecord as any).break_start && (attendanceRecord as any).break_end) {
        const breakStart = new Date(`${today}T${(attendanceRecord as any).break_start}`);
        const breakEnd = new Date(`${today}T${(attendanceRecord as any).break_end}`);
        const breakHours = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60);
        workingHours -= breakHours;
      }
    }

    const updateQuery = `
      UPDATE attendance 
      SET check_out = ?, working_hours = ? 
      WHERE employee_id = ? AND date = ?
    `;
    await executeQuery(updateQuery, [currentTime, workingHours, employeeId, today]);

    const result = await this.getByEmployeeAndDate(employeeId, today);
    if (!result) {
      throw new Error('Failed to retrieve attendance record');
    }
    return result;
  }

  // Start break
  static async startBreak(employeeId: number, breakStartTime?: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = breakStartTime || new Date().toTimeString().split(' ')[0];

    const updateQuery = `
      UPDATE attendance 
      SET break_start = ? 
      WHERE employee_id = ? AND date = ?
    `;
    await executeQuery(updateQuery, [currentTime, employeeId, today]);

    const result = await this.getByEmployeeAndDate(employeeId, today);
    if (!result) {
      throw new Error('Failed to retrieve attendance record');
    }
    return result;
  }

  // End break
  static async endBreak(employeeId: number, breakEndTime?: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = breakEndTime || new Date().toTimeString().split(' ')[0];

    const updateQuery = `
      UPDATE attendance 
      SET break_end = ? 
      WHERE employee_id = ? AND date = ?
    `;
    await executeQuery(updateQuery, [currentTime, employeeId, today]);

    const result = await this.getByEmployeeAndDate(employeeId, today);
    if (!result) {
      throw new Error('Failed to retrieve attendance record');
    }
    return result;
  }

  // Get attendance by employee and specific date
  static async getByEmployeeAndDate(employeeId: number, date: string): Promise<Attendance | null> {
    const query = `
      SELECT a.*, e.first_name, e.last_name, e.employee_id 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      WHERE a.employee_id = ? AND a.date = ?
    `;
    const result = await executeQuery(query, [employeeId, date]);
    return result.length > 0 ? result[0] : null;
  }

  // Mark employee as absent
  static async markAbsent(employeeId: number, date: string, notes?: string): Promise<Attendance> {
    // Check if record exists
    const existing = await this.getByEmployeeAndDate(employeeId, date);
    
    if (existing) {
      const updateQuery = `UPDATE attendance SET status = 'absent', notes = ? WHERE employee_id = ? AND date = ?`;
      await executeQuery(updateQuery, [notes || null, employeeId, date]);
    } else {
      const insertQuery = `
        INSERT INTO attendance (employee_id, date, status, notes) 
        VALUES (?, ?, 'absent', ?)
      `;
      await executeQuery(insertQuery, [employeeId, date, notes || null]);
    }

    const result = await this.getByEmployeeAndDate(employeeId, date);
    if (!result) {
      throw new Error('Failed to retrieve attendance record');
    }
    return result;
  }

  // Get attendance statistics
  static async getStatistics(startDate: string, endDate: string): Promise<any> {
    const queries = [
      `SELECT COUNT(*) as total FROM attendance WHERE date BETWEEN ? AND ? AND status = 'present'`,
      `SELECT COUNT(*) as total FROM attendance WHERE date BETWEEN ? AND ? AND status = 'absent'`,
      `SELECT COUNT(*) as total FROM attendance WHERE date BETWEEN ? AND ? AND status = 'late'`,
      `SELECT AVG(working_hours) as average FROM attendance WHERE date BETWEEN ? AND ? AND status = 'present'`,
    ];

    const params = [startDate, endDate];
    const [present, absent, late, avgHours] = await Promise.all(
      queries.map(query => executeQuery(query, params))
    );

    return {
      totalPresent: present[0].total,
      totalAbsent: absent[0].total,
      totalLate: late[0].total,
      averageWorkingHours: avgHours[0].average || 0
    };
  }

  // Get monthly attendance summary for an employee
  static async getMonthlyAttendance(employeeId: number, year: number, month: number): Promise<any> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

    const query = `
      SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_days,
        SUM(working_hours) as total_hours,
        AVG(working_hours) as average_hours
      FROM attendance 
      WHERE employee_id = ? AND date BETWEEN ? AND ?
    `;

    const result = await executeQuery(query, [employeeId, startDate, endDate]);
    return result[0];
  }
}