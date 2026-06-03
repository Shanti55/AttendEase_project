import NotificationBell from './NotificationBell.jsx';

const Navbar = ({ user, onLogout }) => {
  const roleColors = {
    ADMIN: 'bg-[#C9963A] text-[#0D1B2A]',
    EMPLOYEE: 'bg-[#1B263B] text-[#C9963A] border border-[#C9963A]/40',
  };

  return (
    <nav className="bg-[#0D1B2A] text-white px-4 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="text-xl font-bold tracking-tight">
            Attend<span className="text-[#C9963A]">Ease</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300 hidden sm:inline">
            Hello, <strong className="text-white">{user?.name}</strong>
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColors[user?.role] || roleColors.EMPLOYEE}`}
          >
            {user?.role}
          </span>
          {user?.role === 'EMPLOYEE' && <NotificationBell dark />}
          <button
            onClick={onLogout}
            className="text-sm bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
