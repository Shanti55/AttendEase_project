import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import Navbar from '../components/Navbar.jsx';
import AttendanceButton from '../components/AttendanceButton.jsx';
import TaskCard from '../components/TaskCard.jsx';

const FILTERS = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [markLoading, setMarkLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const [officeHours, setOfficeHours] = useState(null);
  const [timingMessage, setTimingMessage] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '' });
  const [taskLoading, setTaskLoading] = useState(false);

  const isSameDay = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const todayRecord = attendanceRecords.find((r) => isSameDay(r.date, new Date()));
  const markedToday = Boolean(todayRecord);
  const checkedOut = Boolean(todayRecord?.checkOut);

  const last7Days = attendanceRecords.slice(0, 7);

  const fetchAttendance = useCallback(async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/attendance/stats'),
      ]);
      if (listRes.data.success) {
        setAttendanceRecords(listRes.data.data.records);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const { data } = await api.get('/tasks', { params });
      if (data.success) {
        setTasks(data.data.tasks);
      }
    } catch (err) {
      console.error(err);
    }
  }, [filter]);

  useEffect(() => {
    fetchAttendance();
    api.get('/settings/office').then(({ data }) => {
      if (data.success) setOfficeHours(data.data.settings);
    });
  }, [fetchAttendance]);

  useEffect(() => {
    if (todayRecord?.timingMessage) setTimingMessage(todayRecord.timingMessage);
    if (todayRecord?.checkoutMessage) setCheckoutMessage(todayRecord.checkoutMessage);
  }, [todayRecord]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleMarkAttendance = async () => {
    setAttendanceError('');
    setMarkLoading(true);
    try {
      const { data } = await api.post('/attendance/mark');
      if (data.success) {
        setTimingMessage(data.message || data.data?.attendance?.timingMessage || '');
        await fetchAttendance();
      }
    } catch (err) {
      setAttendanceError(err.response?.data?.message || 'Could not mark attendance');
    } finally {
      setMarkLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setAttendanceError('');
    setCheckoutLoading(true);
    try {
      const { data } = await api.post('/attendance/checkout');
      if (data.success) {
        setCheckoutMessage(data.message || '');
        await fetchAttendance();
      }
    } catch (err) {
      setAttendanceError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post('/attendance/checkout');
    } catch {
      // not marked today or already checked out
    } finally {
      setCheckoutLoading(false);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resetTaskForm = () => {
    setTaskForm({ title: '', description: '', dueDate: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description || undefined,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined,
      };

      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      resetTaskForm();
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Task save failed');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <AttendanceButton
            markedToday={markedToday}
            checkedOut={checkedOut}
            loading={markLoading}
            checkoutLoading={checkoutLoading}
            onMark={handleMarkAttendance}
            onCheckout={handleCheckOut}
            stats={stats}
            officeHours={officeHours}
            timingMessage={timingMessage}
            checkoutMessage={checkoutMessage}
          />

          {attendanceError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {attendanceError}
            </p>
          )}

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-[#0D1B2A] mb-3">Last 7 days</h3>
            {last7Days.length === 0 ? (
              <p className="text-sm text-gray-400">No attendance history yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {last7Days.map((r) => (
                  <span
                    key={r.id}
                    className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full"
                  >
                    {new Date(r.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">My Tasks</h2>
            <button
              onClick={() => {
                resetTaskForm();
                setShowForm(!showForm);
              }}
              className="text-sm bg-[#0D1B2A] text-white px-3 py-1.5 rounded-lg hover:bg-[#1B263B]"
            >
              + Add Task
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  filter === f
                    ? 'bg-[#C9963A] text-[#0D1B2A] border-[#C9963A] font-semibold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#C9963A]'
                }`}
              >
                {f === 'IN_PROGRESS' ? 'IN PROGRESS' : f}
              </button>
            ))}
          </div>

          {showForm && (
            <form
              onSubmit={handleTaskSubmit}
              className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3"
            >
              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
                minLength={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description (optional)"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={taskLoading}
                  className="text-sm bg-[#C9963A] text-[#0D1B2A] font-semibold px-4 py-2 rounded-lg"
                >
                  {taskLoading ? 'Saving...' : editingTask ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={resetTaskForm}
                  className="text-sm text-gray-500 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 max-h-[32rem] overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                No tasks yet. Click &quot;+ Add Task&quot; to get started.
              </p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
