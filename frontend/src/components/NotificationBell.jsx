import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

const NotificationBell = ({ dark = false }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setItems(data.data.notifications);
        setUnread(data.data.unreadCount);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, [load]);

  const markRead = async () => {
    await api.patch('/notifications/read-all');
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative text-sm border rounded-lg px-3 py-1.5 ${
          dark
            ? 'border-white/30 text-white hover:bg-white/10'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        Alerts
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-sm font-semibold text-[#0D1B2A]">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markRead}
                className="text-xs text-[#C9963A] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-64 overflow-y-auto divide-y">
            {items.length === 0 ? (
              <li className="px-3 py-4 text-sm text-gray-400 text-center">No messages yet</li>
            ) : (
              items.map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-3 text-sm ${n.read ? 'text-gray-500 bg-white' : 'text-[#0D1B2A] bg-amber-50/80'}`}
                >
                  <p>{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
