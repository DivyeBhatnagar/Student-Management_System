import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AdmissionsPage from './pages/Admissions';
import AcademicsPage from './pages/Academics';
import FeesPage from './pages/Fees';
import HostelPage from './pages/Hostel';

const PrivateRoute = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
};

const Dashboard = () => {
  const userRole = localStorage.getItem('userRole');
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="hostel" element={<HostelPage />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
