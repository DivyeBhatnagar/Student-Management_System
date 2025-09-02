import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real app, you'd have actual authentication logic here.
    // For this demo, we'll just navigate to the dashboard based on the selected role.
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-soft">
        <h1 className="text-3xl font-bold text-center text-foreground">Login</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-muted-foreground">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-accent border border rounded-xl shadow-soft-inset focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-lg font-semibold text-primary-foreground bg-primary rounded-xl shadow-soft hover:bg-primary/90 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
