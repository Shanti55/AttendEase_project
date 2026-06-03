export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const isAdmin = (user) => user?.role === 'ADMIN';

// Hidden path — not linked anywhere for students (set in .env)
export const ADMIN_PANEL_PATH = import.meta.env.VITE_ADMIN_PATH || 'control-room';
