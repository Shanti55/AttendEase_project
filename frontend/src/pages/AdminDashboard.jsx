import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { getStoredUser } from '../utils/auth.js';
import OfficeSettingsPanel from '../components/OfficeSettingsPanel.jsx';

const statusBadge = {
  PRESENT: 'bg-green-100 text-green-800',
  LEFT: 'bg-blue-100 text-blue-800',
  ABSENT: 'bg-red-100 text-red-800',
  HALF_DAY: 'bg-amber-100 text-amber-900',
};

const statusLabel = {
  PRESENT: 'In office',
  LEFT: 'Left office',
  ABSENT: 'Absent',
  HALF_DAY: 'Half day',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [overview, setOverview] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [timeEdits, setTimeEdits] = useState({});

  const fetchOverview = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/admin/attendance/today');
      if (data.success) {
        setOverview(data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied. Admin account only.');
      } else {
        setError(err.response?.data?.message || 'Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 8000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  const handleManualMark = async (userId, status) => {
    setSavingId(userId);
    setError('');
    setSuccess('');
    const times = timeEdits[userId] || {};

    try {
      const { data } = await api.put(`/admin/attendance/${userId}`, {
        status,
        checkInTime: times.checkIn || undefined,
        checkOutTime: times.checkOut || undefined,
      });
      if (data.success) {
        setSuccess(data.message);
        await fetchOverview();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update attendance');
    } finally {
      setSavingId(null);
    }
  };

  const setTimeField = (userId, field, value) => {
    setTimeEdits((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const todayLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex">
      <aside className="w-64 shrink-0 bg-[#1B263B] text-white p-6 hidden md:flex flex-col border-r border-[#C9963A]/20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#C9963A]">Admin only</p>
          <h1 className="text-xl font-bold mt-1">
            Attend<span className="text-[#C9963A]">Ease</span>
          </h1>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Manually mark Present, Absent or Half-day. Optional check-in/out times (24h, e.g. 09:30).
        </p>
        <div className="mt-auto text-sm text-gray-400 border-t border-gray-700 pt-4">
          <p className="text-white font-medium">{user?.name}</p>
          <span className="inline-block mt-2 text-xs bg-[#C9963A] text-[#0D1B2A] px-2 py-0.5 rounded font-semibold">
            ADMIN
          </span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#1B263B] text-white px-4 py-4 flex items-center justify-between border-b border-[#C9963A]/20 gap-2 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-sm text-gray-300">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <p className="text-xs text-gray-400 hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString('en-IN')}
              </p>
            )}
            <button
              onClick={fetchOverview}
              className="text-sm border border-[#C9963A]/50 text-[#C9963A] px-3 py-1.5 rounded-lg"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600/80 px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {loading && <p className="text-gray-300">Loading...</p>}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-200 rounded-lg p-3 mb-4 text-sm">
              {success}
            </div>
          )}

          {overview && (
            <>
              <OfficeSettingsPanel onSaved={() => fetchOverview()} />

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
                {[
                  { label: 'Staff', value: overview.summary.totalEmployees, color: 'text-white' },
                  { label: 'Present', value: overview.summary.present, color: 'text-green-400' },
                  { label: 'Half day', value: overview.summary.halfDay, color: 'text-amber-400' },
                  { label: 'Absent', value: overview.summary.absent, color: 'text-red-400' },
                  { label: 'Late', value: overview.summary.late, color: 'text-orange-400' },
                  { label: 'Checked out', value: overview.summary.loggedOut, color: 'text-blue-400' },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-[#1B263B] rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-xs text-gray-400">{card.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#1B263B] rounded-xl border border-white/10 overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[720px]">
                  <thead className="bg-[#0D1B2A] text-gray-300 uppercase text-xs">
                    <tr>
                      <th className="px-3 py-3">Employee</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">In</th>
                      <th className="px-3 py-3">Out</th>
                      <th className="px-3 py-3">Timing</th>
                      <th className="px-3 py-3">Manual mark</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-200 divide-y divide-white/5">
                    {overview.rows.map((row) => (
                      <tr key={row.userId} className="align-top">
                        <td className="px-3 py-3">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-xs text-gray-500">{row.email}</p>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge[row.status] || statusBadge.ABSENT}`}
                          >
                            {statusLabel[row.status] || row.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">{row.checkInTime || '—'}</td>
                        <td className="px-3 py-3">{row.checkOutTime || '—'}</td>
                        <td className="px-3 py-3 text-xs">
                          <span
                            className={
                              row.lateMinutes > 0
                                ? 'text-orange-300 font-medium'
                                : row.earlyMinutes > 0
                                  ? 'text-green-300'
                                  : 'text-gray-400'
                            }
                          >
                            {row.timingNote}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {['PRESENT', 'HALF_DAY', 'ABSENT'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                disabled={savingId === row.userId}
                                onClick={() => handleManualMark(row.userId, s)}
                                className={`text-xs px-2 py-1 rounded font-medium disabled:opacity-50 ${
                                  s === 'PRESENT'
                                    ? 'bg-green-700 text-white hover:bg-green-600'
                                    : s === 'HALF_DAY'
                                      ? 'bg-amber-600 text-white hover:bg-amber-500'
                                      : 'bg-red-700/80 text-white hover:bg-red-600'
                                }`}
                              >
                                {s === 'PRESENT' ? 'Present' : s === 'HALF_DAY' ? 'Half' : 'Absent'}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-1 items-center">
                            <input
                              type="time"
                              title="Check-in time"
                              className="text-xs bg-[#0D1B2A] border border-gray-600 rounded px-1 py-0.5 w-[5.5rem]"
                              value={timeEdits[row.userId]?.checkIn ?? ''}
                              onChange={(e) =>
                                setTimeField(row.userId, 'checkIn', e.target.value)
                              }
                            />
                            <input
                              type="time"
                              title="Check-out time"
                              className="text-xs bg-[#0D1B2A] border border-gray-600 rounded px-1 py-0.5 w-[5.5rem]"
                              value={timeEdits[row.userId]?.checkOut ?? ''}
                              onChange={(e) =>
                                setTimeField(row.userId, 'checkOut', e.target.value)
                              }
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Set time, then tap Present/Half
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
