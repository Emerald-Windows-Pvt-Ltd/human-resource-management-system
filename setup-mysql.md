# MySQL Setup Guide for Employee Management System

## Step 1: Install MySQL

### Option A: MySQL Installer (Recommended)
1. Visit: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer and choose "Developer Default"
4. Set root password: `admin123` (or your preferred password)
5. Keep default port: `3306`

### Option B: Using Chocolatey (if installed)
```powershell
choco install mysql
```

### Option C: Using Winget (alternative)
```powershell
winget install Oracle.MySQL
```

## Step 2: Verify MySQL Installation

Open Command Prompt or PowerShell as Administrator and run:
```cmd
mysql --version
```

## Step 3: Start MySQL Service

```cmd
net start mysql80
```

## Step 4: Connect to MySQL

```cmd
mysql -u root -p
```
Enter your root password when prompted.

## Step 5: Create Database and User

Once connected to MySQL, run these commands:

```sql
-- Create the database
CREATE DATABASE employee_management;

-- Create a dedicated user for the application
CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'emp_password123';

-- Grant privileges
GRANT ALL PRIVILEGES ON employee_management.* TO 'emp_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE employee_management;

-- Verify database creation
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

## Step 6: Update Backend Configuration

Update your `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=emp_user
DB_PASSWORD=emp_password123
DB_NAME=employee_management
```

## Step 7: Initialize Database Schema

Run the database initialization script:
```bash
cd backend
npm run init-db
```

## Step 8: Test Connection

Start your backend server:
```bash
npm run dev
```

You should see: "✅ Database connected successfully"

## Troubleshooting

### MySQL Service Not Starting
```cmd
# Start MySQL service
net start mysql80

# Or try
services.msc
# Find MySQL80 service and start it
```

### Access Denied Error
- Make sure you're using the correct username/password
- Check if MySQL service is running
- Verify port 3306 is not blocked by firewall

### Connection Refused
- Ensure MySQL is running on port 3306
- Check Windows Firewall settings
- Verify MySQL configuration

## Default Credentials After Setup
- **Database**: employee_management
- **Username**: emp_user
- **Password**: emp_password123
- **Host**: localhost
- **Port**: 3306

## Next Steps
Once MySQL is set up, your Employee Management System will have:
- Full database functionality
- Real user authentication
- Persistent data storage
- All CRUD operations working