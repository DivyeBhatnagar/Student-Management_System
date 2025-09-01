import api from './api';

// Temporary credentials for development (bypass database)
const TEMP_CREDENTIALS = {
  email: 'admin@student.edu',
  password: 'student123'
};

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      role: string;
      first_name: string;
      last_name: string;
      student_id?: string;
      employee_id?: string;
    };
    token: string;
  };
}

interface User {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  student_id?: string;
  employee_id?: string;
  phone?: string;
  created_at?: string;
  last_login?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Temporary bypass for development - remove this in production!
  if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
    console.log('🔓 Using temporary credentials - bypassing database');
    return {
      success: true,
      message: 'Login successful (temporary)',
      data: {
        token: 'temp-token-' + Date.now(),
        user: {
          id: 1,
          email: email,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    };
  }

  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    console.error('Database login failed, but you can use temporary credentials:', TEMP_CREDENTIALS);
    
    // Extract error message from API response
    const errorMessage = error?.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Call the backend logout endpoint
    await api.post('/auth/logout');
  } catch (error) {
    // Even if backend fails, we still want to logout locally
    console.warn('Backend logout failed, proceeding with local logout:', error);
  }
  
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const register = async (userData: {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string;
  // Additional fields based on role
  [key: string]: any;
}): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to fetch profile';
    throw new Error(errorMessage);
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<void> => {
  try {
    await api.put('/auth/profile', profileData);
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to update profile';
    throw new Error(errorMessage);
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to change password';
    throw new Error(errorMessage);
  }
};
