import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { state } = useAuth();
  const { user } = state;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'faculty': return 'bg-green-500';
      case 'student': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return (firstName + lastName) || user.email.charAt(0).toUpperCase();
  };

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to the Dashboard!';
    const name = user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email;
    const timeOfDay = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
    return `${timeOfDay}, ${name}!`;
  };

  const getDashboardContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
              <p className="text-sm text-gray-500 mt-1">+12 this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Faculty</h3>
              <p className="text-3xl font-bold text-green-600">56</p>
              <p className="text-sm text-gray-500 mt-1">+2 this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Courses</h3>
              <p className="text-3xl font-bold text-purple-600">89</p>
              <p className="text-sm text-gray-500 mt-1">+5 this semester</p>
            </div>
          </div>
        );
      case 'faculty':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
              <p className="text-3xl font-bold text-blue-600">6</p>
              <p className="text-sm text-gray-500 mt-1">Active courses</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Students</h3>
              <p className="text-3xl font-bold text-green-600">180</p>
              <p className="text-sm text-gray-500 mt-1">Total enrolled</p>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Semester</h3>
              <p className="text-3xl font-bold text-blue-600">6</p>
              <p className="text-sm text-gray-500 mt-1">Semester 6</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600">₹15,000</p>
              <p className="text-sm text-gray-500 mt-1">Due date: 15th March</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full ${getRoleColor(user?.role || '')} flex items-center justify-center text-white text-xl font-bold`}>
            {getUserInitials()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
            <p className="text-blue-100 mt-1 capitalize">
              {user?.role} Dashboard - Student Management System
            </p>
            {user?.student_id && (
              <p className="text-blue-100 text-sm">Student ID: {user.student_id}</p>
            )}
            {user?.employee_id && (
              <p className="text-blue-100 text-sm">Employee ID: {user.employee_id}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Role-specific content */}
      {getDashboardContent()}
      
      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">New student admission processed</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Fee payment received</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Hostel allocation completed</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Development Mode Active</h3>
            <p className="text-sm text-blue-700 mt-1">
              This dashboard shows mock data for demonstration. In production, this would display real-time data from your database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
