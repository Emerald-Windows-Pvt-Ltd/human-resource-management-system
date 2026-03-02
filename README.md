# Employee Management System

A comprehensive full-stack employee management system built with modern web technologies. This system provides complete employee lifecycle management with authentication, attendance tracking, department management, and performance monitoring.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, HR, and Employee roles with appropriate permissions
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Session Management**: Token expiration and refresh mechanisms

### 👥 Employee Management
- **Complete CRUD Operations**: Create, Read, Update, Delete employee records
- **Advanced Filtering**: Search and filter employees by various criteria
- **Bulk Operations**: Import/export employee data
- **Profile Management**: Comprehensive employee profile with personal and professional details

### 🏢 Organizational Structure
- **Department Management**: Create and manage departments with hierarchical structure
- **Position Management**: Define job positions with salary ranges and descriptions
- **Manager Assignment**: Assign department managers and track reporting relationships
- **Organizational Charts**: Visual representation of company hierarchy

### ⏰ Attendance & Time Tracking
- **Real-time Check-in/Check-out**: Track employee attendance with timestamps
- **Break Management**: Monitor break times and durations
- **Attendance Reports**: Generate detailed attendance statistics
- **Late Arrival Tracking**: Automatic detection of late arrivals

### 📊 Analytics & Reporting
- **Dashboard Overview**: Real-time company statistics and metrics
- **Performance Analytics**: Track employee performance and productivity
- **Custom Reports**: Generate reports based on various parameters
- **Data Visualization**: Charts and graphs for better data interpretation

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Material-UI v5 with custom theming
- **Intuitive Navigation**: Easy-to-use interface with clear workflows
- **Accessibility**: WCAG compliant design for better accessibility

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+ with Express.js
- **Language**: TypeScript for type safety
- **Database**: MySQL 8.0 with connection pooling
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt
- **Validation**: Express-validator for request validation
- **Security**: Helmet, CORS, and rate limiting
- **Development**: Nodemon for auto-reload

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5 with custom theme
- **Routing**: React Router v6 for SPA navigation
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API with custom hooks
- **Build Tool**: Create React App with Webpack
- **Development**: Hot Module Replacement (HMR)

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm**: v8 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/downloads))

### 📁 Project Structure

```
employee-management-system/
├── backend/                    # Node.js Express API
│   ├── src/                    # Source code
│   │   ├── config/             # Database and app configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Authentication and validation
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helper functions
│   │   └── index.ts            # Application entry point
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration
├── frontend/                   # React application
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Utility functions
│   │   └── App.tsx             # Main application
│   ├── package.json            # Frontend dependencies
│   └── tsconfig.json           # TypeScript configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
└── LICENSE                     # MIT License
```

### 🛠️ Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the backend directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management

# JWT Configuration
JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

4. **Set up MySQL database:**
```sql
CREATE DATABASE employee_management;
CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'emp_password123';
GRANT ALL PRIVILEGES ON employee_management.* TO 'emp_user'@'localhost';
FLUSH PRIVILEGES;
```

5. **Initialize the database schema:**
```bash
npm run init-db
```

6. **Start the development server:**
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 🎨 Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables (optional):**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Employee Management System
```

4. **Start the development server:**
```bash
npm start
```

The frontend will be available at `http://localhost:3000` (or next available port if 3000 is occupied)

## 🔐 Default Login Credentials

### Admin User (Full Access)
- **Email**: `admin@company.com`
- **Password**: `admin123`

### HR User (HR Operations)
- **Email**: `hr@company.com`
- **Password**: `hr123`

> **Security Note**: For production deployment, change these default credentials immediately after the first login.

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | Create new user account |
| GET | `/api/auth/profile` | Get authenticated user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change user password |
| POST | `/api/auth/logout` | User logout |

### 👥 Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (paginated, filtered) |
| GET | `/api/employees/:id` | Get specific employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee details |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/department/:id` | Get employees by department |
| GET | `/api/employees/statistics` | Get employee statistics |

### 🏢 Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments/departments` | Get all departments |
| GET | `/api/departments/departments/:id` | Get specific department |
| POST | `/api/departments/departments` | Create new department |
| PUT | `/api/departments/departments/:id` | Update department |
| DELETE | `/api/departments/departments/:id` | Delete department |
| GET | `/api/departments/departments/stats` | Get department statistics |

### 📋 Positions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments/positions` | Get all positions |
| GET | `/api/departments/positions/:id` | Get specific position |
| GET | `/api/departments/departments/:id/positions` | Get positions by department |
| POST | `/api/departments/positions` | Create new position |
| PUT | `/api/departments/positions/:id` | Update position |
| DELETE | `/api/departments/positions/:id` | Delete position |
| GET | `/api/departments/positions/stats` | Get position statistics |

### ⏰ Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get attendance records (filtered) |
| GET | `/api/attendance/employee/:id` | Get employee attendance history |
| GET | `/api/attendance/date/:date` | Get attendance by date |
| POST | `/api/attendance/checkin` | Employee check-in |
| POST | `/api/attendance/checkout` | Employee check-out |
| POST | `/api/attendance/break/start` | Start break time |
| POST | `/api/attendance/break/end` | End break time |
| POST | `/api/attendance/absent` | Mark employee as absent |
| GET | `/api/attendance/statistics` | Get attendance statistics |
| GET | `/api/attendance/employee/:id/monthly` | Get monthly attendance report |
| GET | `/api/attendance/employee/:id/status` | Get current attendance status |

## 🗄️ Database Schema

### Core Tables

#### `users`
- Authentication and authorization
- Role-based access control (admin, hr, employee)
- Profile information and preferences

#### `employees`
- Complete employee profile data
- Personal and professional information
- Employment status and history

#### `departments`
- Organizational structure
- Department hierarchy and management
- Budget and resource allocation

#### `positions`
- Job roles and descriptions
- Salary ranges and requirements
- Department associations

#### `attendance`
- Daily attendance tracking
- Check-in/check-out timestamps
- Break management and overtime

### Additional Tables

#### `leave_requests`
- Leave application and approval workflow
- Different leave types (vacation, sick, personal)
- Approval history and notifications

#### `performance_reviews`
- Employee performance evaluation
- Goal setting and tracking
- Feedback and development plans

### Relationships
- One-to-many: Departments → Employees
- One-to-many: Positions → Employees
- One-to-many: Employees → Attendance
- One-to-many: Employees → Leave Requests
- One-to-many: Employees → Performance Reviews

## 👥 User Roles & Permissions

### 🛡️ Admin Role
**Full System Access**
- User management (create, edit, delete users)
- Complete employee CRUD operations
- Department and position management
- Attendance monitoring and reports
- System configuration and settings
- All reporting and analytics

### 📋 HR Role
**Human Resources Operations**
- Employee management and profile updates
- Attendance tracking and reporting
- Leave request processing
- Performance review management
- Department statistics and analytics
- Recruitment and onboarding support

### 👤 Employee Role
**Self-Service Access**
- View and update personal profile
- Check attendance history
- Submit leave requests
- View performance reviews
- Access personal statistics
- Update contact information

## 🧑‍💻 Development Guide

### 🛠️ Backend Development

```bash
cd backend

# Start development server with auto-reload
npm run dev

# Run TypeScript compiler
npm run build

# Run database initialization
npm run init-db

# Run tests (if available)
npm test
```

### 🎨 Frontend Development

```bash
cd frontend

# Start development server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (if needed)
npm run eject
```

### 🔧 Development Tools

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Nodemon**: Auto-reload for backend development
- **React DevTools**: Component debugging
- **Redux DevTools**: State management debugging

### 📁 Environment Configuration

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=emp_user
DB_PASSWORD=emp_password123
DB_NAME=employee_management
JWT_SECRET=your_secret_key_here
PORT=3001
NODE_ENV=development
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Employee Management System
GENERATE_SOURCEMAP=true
```

### 🐛 Debugging

**Backend Debugging**
- Use `console.log` for debugging
- Check logs in terminal
- Use Postman or curl for API testing

**Frontend Debugging**
- React DevTools browser extension
- Browser developer console
- Network tab for API calls
- React error boundaries for error handling

## 📁 Complete Project Structure

```
employee-management-system/
├── backend/                    # Node.js Express API Server
│   ├── dist/                   # Compiled TypeScript files
│   ├── src/                    # Source code
│   │   ├── config/             # Configuration files
│   │   │   ├── database.ts     # Database connection
│   │   │   ├── index.ts        # Environment configuration
│   │   │   ├── init-db.ts      # Database initialization
│   │   │   └── schema.sql      # Database schema
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── employeeController.ts
│   │   │   ├── departmentController.ts
│   │   │   └── attendanceController.ts
│   │   ├── middleware/         # Custom middleware
│   │   │   └── auth.ts         # Authentication middleware
│   │   ├── models/             # Database models
│   │   │   ├── User.ts
│   │   │   ├── Employee.ts
│   │   │   ├── Department.ts
│   │   │   └── Attendance.ts
│   │   ├── routes/             # API routes
│   │   │   ├── auth.ts
│   │   │   ├── employees.ts
│   │   │   ├── departments.ts
│   │   │   └── attendance.ts
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── responseHelper.ts
│   │   └── index.ts            # Main application entry
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/                   # React Application
│   ├── build/                  # Production build
│   ├── public/                 # Static files
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/                    # Source code
│   │   ├── components/         # React components
│   │   │   ├── common/         # Shared components
│   │   │   ├── layout/         # Layout components
│   │   │   └── *.tsx           # Feature components
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Employees.tsx
│   │   │   └── *.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── theme.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── react-app-env.d.ts
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── LICENSE                     # MIT License
└── .github/                    # GitHub configurations
    └── workflows/              # CI/CD workflows
```

## 🤝 Contributing

We welcome contributions to improve the Employee Management System! Here's how you can help:

### 📋 How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of this page

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/employee-management-system.git
   cd employee-management-system
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Follow the coding standards
   - Write clear, descriptive commit messages
   - Add tests if applicable

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add feature: brief description of changes"
   ```

6. **Push to Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template

### 📝 Coding Standards

- **TypeScript**: Use strict typing and follow TypeScript best practices
- **React**: Use functional components with hooks
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for functions and classes
- **Testing**: Write unit tests for new features

### 🐛 Reporting Issues

- Use the GitHub issue tracker
- Include steps to reproduce the problem
- Provide screenshots if applicable
- Specify your environment (OS, browser, Node.js version)

### 💡 Feature Requests

- Check if the feature already exists or is planned
- Provide a clear use case for the feature
- Include mockups or examples if possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Employee Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Material-UI](https://mui.com/) - React components for faster and easier web development
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MySQL](https://www.mysql.com/) - The world's most popular open source database
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale

---

<p align="center">Made with ❤️ by the Employee Management System Team</p>