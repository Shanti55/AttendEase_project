import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios.js';
import { isAdmin, ADMIN_PANEL_PATH } from '../utils/auth.js';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (isAdmin(data.data.user)) {
          navigate(`/${ADMIN_PANEL_PATH}`);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-2">
            <span className="text-3xl">📋</span>
            <h1 className="text-3xl font-bold">
              Attend<span className="text-[#C9963A]">Ease</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Employee Portal — Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1B263B] rounded-2xl shadow-2xl p-8 border border-[#C9963A]/20"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm rounded-lg px-4 py-3 mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-[#C9963A]"
            placeholder="you@company.com"
          />

          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-[#C9963A]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-[#C9963A]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9963A] hover:bg-[#b8862f] disabled:opacity-60 text-[#0D1B2A] font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            New here?{' '}
            <Link to="/register" className="text-[#C9963A] hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
