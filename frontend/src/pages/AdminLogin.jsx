import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { isAdmin, ADMIN_PANEL_PATH } from '../utils/auth.js';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (!data.success) {
        setError('Login failed');
        return;
      }

      if (!isAdmin(data.data.user)) {
        setError(
          'This account is not an admin. Use employee login at /login. Admin is created with: npm run seed:admin'
        );
        return;
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate(`/${ADMIN_PANEL_PATH}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-[#C9963A] text-xs uppercase tracking-widest font-semibold mb-2">
            Admin control room
          </p>
          <h1 className="text-2xl font-bold text-white">
            Attend<span className="text-[#C9963A]">Ease</span> Admin
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sign in only — admin account is not created on Register page
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1B263B] rounded-2xl p-8 border border-[#C9963A]/30"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm text-gray-300 mb-1">Admin email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@attendease.com"
            className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-[#C9963A]"
          />

          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:border-[#C9963A]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9963A] text-[#0D1B2A] font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Enter admin panel'}
          </button>

          <p className="text-center text-gray-500 text-xs mt-6">
            Employee?{' '}
            <Link to="/login" className="text-[#C9963A] hover:underline">
              Go to staff login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
