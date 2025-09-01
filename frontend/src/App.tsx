import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Admissions from './pages/Admissions';
import Fees from './pages/Fees';
import Hostel from './pages/Hostel';
import Academics from './pages/Academics';
// Neumorphism components
import LoginNeumorphism from './components/LoginNeumorphism';
import DashboardNeumorphism from './components/DashboardNeumorphism';

// Protected login route that redirects if already authenticated
const LoginRoute = () => {
  const { state } = useAuth();
  return state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

// Main App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/" element={<LoginRoute />} />
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/hostel" element={<Hostel />} />
          <Route path="/academics" element={<Academics />} />
        </Route>
      </Route>
      
      {/* Neumorphism Routes (Alternative UI) */}
      <Route path="/neu/login" element={<LoginNeumorphism />} />
      <Route path="/neu/dashboard" element={<DashboardNeumorphism />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
