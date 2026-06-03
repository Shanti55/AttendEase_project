import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminGate from './pages/AdminGate.jsx';
import { getStoredUser, isAdmin, ADMIN_PANEL_PATH } from './utils/auth.js';

const ProtectedRoute = ({ children, adminOnly = false, employeeOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (employeeOnly && isAdmin(user)) {
    return <Navigate to={`/${ADMIN_PANEL_PATH}`} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute employeeOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path={`/${ADMIN_PANEL_PATH}`} element={<AdminGate />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
