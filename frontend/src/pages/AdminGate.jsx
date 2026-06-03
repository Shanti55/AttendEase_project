import { Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import { getStoredUser, isAdmin } from '../utils/auth.js';

// /control-room → login form OR dashboard (if admin already signed in)
const AdminGate = () => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token) {
    return <AdminLogin />;
  }

  if (!isAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboard />;
};

export default AdminGate;
