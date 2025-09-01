import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { 
  NeuContainer, 
  NeuCard, 
  NeuInput, 
  NeuButton, 
  NeuLabel 
} from './ui/NeumorphismComponents';

function LoginNeumorphism() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await login(email, password);
      console.log(data);
      // Handle successful login
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      // Handle login error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeuContainer className="flex items-center justify-center p-6">
      <NeuCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">
            Sign in to your Student Management Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <NeuLabel htmlFor="email">Email Address</NeuLabel>
            <NeuInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <NeuLabel htmlFor="password">Password</NeuLabel>
            <NeuInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <NeuButton
              type="submit"
              disabled={loading}
              className="w-full text-center"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </NeuButton>
          </div>
        </form>

        {/* Temporary Development Credentials */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-neu-sm border border-blue-100">
          <p className="text-blue-800 text-sm font-semibold mb-2">🔧 Development Mode</p>
          <div className="text-sm text-blue-700 space-y-1">
            <p><span className="font-medium">Email:</span> admin@student.edu</p>
            <p><span className="font-medium">Password:</span> student123</p>
          </div>
          <p className="text-blue-600 text-xs mt-2">Temporary credentials to access all pages</p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Forgot your password? <span className="text-blue-600 cursor-pointer hover:underline">Reset here</span>
          </p>
        </div>
      </NeuCard>
    </NeuContainer>
  );
}

export default LoginNeumorphism;
