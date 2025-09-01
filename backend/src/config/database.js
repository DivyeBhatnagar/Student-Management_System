const { Pool } = require('pg');

// Database connection pool
let pool;

const connectDatabase = async () => {
  try {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'student_management_erp',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      max: 20, // maximum number of connections in the pool
      idleTimeoutMillis: 30000, // close idle connections after 30 seconds
      connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test the connection
    const client = await pool.connect();
    console.log('Database connection established successfully');
    client.release();

    // Create tables if they don't exist
    await createTables();
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'super_admin')),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Students table (extends users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        date_of_birth DATE,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
        address TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        course VARCHAR(100),
        semester INTEGER,
        academic_year VARCHAR(10),
        admission_date DATE,
        graduation_date DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'dropped', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Faculty table (extends users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        department VARCHAR(100),
        designation VARCHAR(100),
        qualification VARCHAR(200),
        experience_years INTEGER,
        joining_date DATE,
        salary DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
        address TEXT,
        course VARCHAR(100) NOT NULL,
        previous_education JSONB,
        documents JSONB, -- Store file URLs/paths
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted')),
        reviewed_by UUID REFERENCES users(id),
        review_date TIMESTAMP,
        review_comments TEXT,
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fee structures table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fee_structures (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        course VARCHAR(100),
        semester INTEGER,
        academic_year VARCHAR(10),
        tuition_fee DECIMAL(10, 2) DEFAULT 0,
        hostel_fee DECIMAL(10, 2) DEFAULT 0,
        library_fee DECIMAL(10, 2) DEFAULT 0,
        lab_fee DECIMAL(10, 2) DEFAULT 0,
        transport_fee DECIMAL(10, 2) DEFAULT 0,
        miscellaneous_fee DECIMAL(10, 2) DEFAULT 0,
        total_fee DECIMAL(10, 2) GENERATED ALWAYS AS (
          COALESCE(tuition_fee, 0) + 
          COALESCE(hostel_fee, 0) + 
          COALESCE(library_fee, 0) + 
          COALESCE(lab_fee, 0) + 
          COALESCE(transport_fee, 0) + 
          COALESCE(miscellaneous_fee, 0)
        ) STORED,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Student fees table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        fee_structure_id UUID REFERENCES fee_structures(id),
        academic_year VARCHAR(10) NOT NULL,
        semester INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        paid_amount DECIMAL(10, 2) DEFAULT 0,
        due_amount DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - COALESCE(paid_amount, 0)) STORED,
        due_date DATE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fee payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fee_payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_fee_id UUID REFERENCES student_fees(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100) UNIQUE,
        razorpay_payment_id VARCHAR(100),
        razorpay_order_id VARCHAR(100),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        receipt_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hostels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hostels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('boys', 'girls', 'mixed')),
        total_rooms INTEGER NOT NULL,
        occupied_rooms INTEGER DEFAULT 0,
        facilities JSONB,
        warden_name VARCHAR(100),
        warden_contact VARCHAR(20),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hostel rooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hostel_rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
        room_number VARCHAR(20) NOT NULL,
        room_type VARCHAR(20) CHECK (room_type IN ('single', 'double', 'triple', 'quadruple')),
        capacity INTEGER NOT NULL,
        occupied_beds INTEGER DEFAULT 0,
        facilities JSONB,
        rent DECIMAL(10, 2),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(hostel_id, room_number)
      )
    `);

    // Hostel allocations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hostel_allocations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        room_id UUID REFERENCES hostel_rooms(id) ON DELETE CASCADE,
        allocation_date DATE NOT NULL,
        vacation_date DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'vacated', 'transferred')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subjects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        course VARCHAR(100),
        semester INTEGER,
        credits INTEGER,
        faculty_id UUID REFERENCES faculty(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('mid_term', 'final', 'internal', 'assignment', 'quiz')),
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        academic_year VARCHAR(10) NOT NULL,
        semester INTEGER NOT NULL,
        max_marks INTEGER NOT NULL,
        exam_date DATE,
        duration_minutes INTEGER,
        instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Student exam results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_exam_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
        marks_obtained DECIMAL(5, 2),
        grade VARCHAR(5),
        remarks TEXT,
        is_absent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, exam_id)
      )
    `);

    // Attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')) DEFAULT 'present',
        remarks TEXT,
        marked_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, subject_id, date)
      )
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100),
        record_id UUID,
        old_values JSONB,
        new_values JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('COMMIT');
    console.log('✅ All database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Get database pool instance
const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return pool;
};

// Execute query with error handling
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  connectDatabase,
  getPool,
  query
};
