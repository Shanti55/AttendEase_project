import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data.success) {
        navigate('/login', { state: { message: 'Account created! Please sign in.' } });
      }
    } catch (err) {
      const validationErrors = err.response?.data?.data?.errors;
      if (validationErrors?.length) {
        setError(validationErrors.map((e) => e.message).join(', '));
      } else if (!err.response) {
        setError(
          'Cannot reach server. Is backend running on port 5001? Check VITE_API_URL in frontend/.env'
        );
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-2">
            <span className="text-3xl">📋</span>
            <h1 className="text-3xl font-bold">
              Attend<span className="text-[#C9963A]">Ease</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Create your employee account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1B263B] rounded-2xl shadow-2xl p-8 border border-[#C9963A]/20"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Register</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Shanti Kumari' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@company.com' },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#C9963A]"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-[#C9963A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-[#C9963A]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-[#0D1B2A] border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#C9963A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9963A] hover:bg-[#b8862f] disabled:opacity-60 text-[#0D1B2A] font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C9963A] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
