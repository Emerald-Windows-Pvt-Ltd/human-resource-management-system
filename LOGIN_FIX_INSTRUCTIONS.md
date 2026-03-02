# Employee Management System - Login Fix Instructions

## Problem
The login is failing with "Invalid email or password" because the password hash in the database is incorrect.

## Solution Steps

### Option 1: Update via MySQL Command Line
1. Open MySQL command line or MySQL Workbench
2. Connect to your database
3. Run this command:
```sql
UPDATE users 
SET password = '$2b$12$TUGwUP/219.SFWO2duKdbuQxbJT.MMOfpdTVTgHmqKafHEHO7n4GC' 
WHERE email = 'admin@empmate.com';
```

### Option 2: Use the SQL File
1. Navigate to: `d:\EMP MATE\backend\fix-admin-password.sql`
2. Execute this file in your MySQL database

### Option 3: Recreate the Admin User
If the above doesn't work, you can delete and recreate the admin user:
```sql
DELETE FROM users WHERE email = 'admin@empmate.com';

INSERT INTO users (username, email, password, role, first_name, last_name, phone_number, is_active, created_at, updated_at) 
VALUES (
    'admin',
    'admin@empmate.com',
    '$2b$12$TUGwUP/219.SFWO2duKdbuQxbJT.MMOfpdTVTgHmqKafHEHO7n4GC',
    'admin',
    'System',
    'Administrator',
    '+1234567890',
    1,
    NOW(),
    NOW()
);
```

## After Fixing
Once you've updated the password, you can login with:
- **Email**: `admin@empmate.com`
- **Password**: `admin123`

## Current Status
- ✅ Backend API is running on http://localhost:3001
- ✅ Frontend is running on http://localhost:3002
- ✅ Database connection is working
- ✅ Employee form issues are fixed (using EmployeeFormSimple.tsx)
- ❌ Admin password needs to be updated in database

## Test Login
After updating the password, test the API directly:
```bash
# Test in PowerShell:
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@empmate.com","password":"admin123"}'
```

This should return a successful response with user data and token.