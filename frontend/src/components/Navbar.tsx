import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOutsideClick } from '../hooks/useOutsideClick';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { user } = state;
  
  const menuRef = useOutsideClick(() => {
    setIsUserMenuOpen(false);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.first_name} ${user.last_name}`.trim() || user.email;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return (firstName + lastName) || user.email.charAt(0).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'faculty': return 'bg-green-500';
      case 'student': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200">
              Student Management System
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/dashboard" 
              className="hover:text-blue-200 px-3 py-2 rounded transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/admissions" 
              className="hover:text-blue-200 px-3 py-2 rounded transition-colors"
            >
              Admissions
            </Link>
            <Link 
              to="/fees" 
              className="hover:text-blue-200 px-3 py-2 rounded transition-colors"
            >
              Fees
            </Link>
            <Link 
              to="/hostel" 
              className="hover:text-blue-200 px-3 py-2 rounded transition-colors"
            >
              Hostel
            </Link>
            <Link 
              to="/academics" 
              className="hover:text-blue-200 px-3 py-2 rounded transition-colors"
            >
              Academics
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 hover:bg-blue-800 px-3 py-2 rounded-lg transition-colors"
            >
              {/* User Avatar */}
              <div className={`w-8 h-8 rounded-full ${getRoleColor(user?.role || '')} flex items-center justify-center text-sm font-semibold`}>
                {getUserInitials()}
              </div>
              
              {/* User Info */}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{getUserDisplayName()}</div>
                <div className="text-xs text-blue-200 capitalize">
                  {user?.role} {user?.student_id && `• ${user.student_id}`} {user?.employee_id && `• ${user.employee_id}`}
                </div>
              </div>
              
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div ref={menuRef} className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${getRoleColor(user?.role || '')} flex items-center justify-center text-white font-semibold`}>
                      {getUserInitials()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {user?.role} {user?.student_id && `• ${user.student_id}`} {user?.employee_id && `• ${user.employee_id}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    View Profile
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Settings
                  </Link>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
