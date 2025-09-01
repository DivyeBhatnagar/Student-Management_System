# Student Management ERP - API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

## 🔧 Overview

The Student Management ERP API is built with Node.js, Express, and PostgreSQL. It provides comprehensive endpoints for managing students, faculty, admissions, fees, hostels, and examinations.

**Base URL:** `http://localhost:5000/api`

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd student-management-erp/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Health Check:**
   ```
   GET http://localhost:5000/health
   ```

## 💾 Database Setup

### PostgreSQL Installation

**Windows:**
1. Download PostgreSQL from [official website](https://www.postgresql.org/download/windows/)
2. Run installer and follow setup wizard
3. Remember the password for 'postgres' user

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Database Configuration

1. **Create Database:**
   ```sql
   CREATE DATABASE student_management_erp;
   ```

2. **Update .env file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=student_management_erp
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

3. **Tables are created automatically** when the server starts.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Headers Required for Protected Routes:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### User Roles:
- **student**: Access to personal data, fees, hostel, results
- **faculty**: Access to subjects, attendance, exam management
- **admin**: Full access to system management
- **super_admin**: Complete system access and configuration

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "student",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  // Student-specific fields
  "date_of_birth": "2000-05-15",
  "gender": "male",
  "address": "123 Main St, City, State",
  "course": "Computer Science",
  "semester": 1,
  "academic_year": "2024-2025",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567891"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "456 New St, City, State"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Dashboard Endpoints

#### Admin Dashboard
```http
GET /api/dashboard/admin
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 1500,
      "totalFaculty": 120,
      "totalAdmissions": 2000,
      "totalRevenue": 500000,
      "recentAdmissions": 150
    },
    "feeStatistics": {
      "total_students": 1500,
      "paid_students": 1200,
      "pending_students": 200,
      "overdue_students": 100,
      "total_fees": 1000000,
      "collected_fees": 800000,
      "pending_fees": 200000
    },
    "trends": {
      "admissions": [...],
      "feeCollection": [...]
    }
  }
}
```

#### Faculty Dashboard
```http
GET /api/dashboard/faculty
Authorization: Bearer <faculty-token>
```

#### Student Dashboard
```http
GET /api/dashboard/student
Authorization: Bearer <student-token>
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## ❌ Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### Common Error Messages

#### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed: Email is required, Password must be at least 6 characters"
}
```

#### Authentication Errors
```json
{
  "success": false,
  "error": "Invalid token"
}
```

#### Database Errors
```json
{
  "success": false,
  "error": "Duplicate entry. This record already exists."
}
```

## 🔒 Security Features

### Rate Limiting
- API endpoints are rate-limited to prevent abuse
- Default: 100 requests per 15-minute window per IP

### Data Validation
- All input data is validated using express-validator
- SQL injection prevention through parameterized queries
- XSS protection via input sanitization

### Password Security
- Passwords are hashed using bcryptjs with salt rounds
- Minimum password length: 6 characters

### CORS Configuration
- Configured for development and production environments
- Only specified origins are allowed

## 🧪 Testing

### Using cURL

**Health Check:**
```bash
curl -X GET http://localhost:5000/health
```

**Register Student:**
```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student",
    "first_name": "Jane",
    "last_name": "Smith",
    "course": "Computer Science",
    "semester": 1,
    "academic_year": "2024-2025",
    "date_of_birth": "2001-01-15"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and tokens
3. Test each endpoint with different user roles

## 📈 Monitoring and Logs

### Health Monitoring
- Health check endpoint: `/health`
- Returns server status, timestamp, and environment

### Audit Logging
- All critical actions are logged with user details
- Logs include: user ID, action, timestamp, IP address

### Error Logging
- Comprehensive error logging in development mode
- Production logs exclude sensitive information

## 🔮 Next Steps

1. **Complete Module Implementation:**
   - Admission management
   - Fee management with payment gateway
   - Hostel allocation system
   - Examination and grading

2. **Advanced Features:**
   - Real-time notifications
   - File upload for documents
   - Email integration
   - SMS notifications
   - Report generation

3. **Performance Optimization:**
   - Database indexing
   - Caching layer
   - Query optimization

4. **Security Enhancements:**
   - Two-factor authentication
   - Session management
   - API versioning

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the troubleshooting section in README.md
- Review the error logs for debugging

---

**Note:** This API is designed for educational and demonstration purposes. For production deployment, additional security measures and optimizations should be implemented.
