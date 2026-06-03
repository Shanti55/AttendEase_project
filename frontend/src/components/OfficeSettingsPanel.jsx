import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const OfficeSettingsPanel = ({ onSaved }) => {
  const [form, setForm] = useState({
    officeStart: '09:30',
    officeEnd: '18:30',
    graceMinutes: 15,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/settings/office')
      .then(({ data }) => {
        if (data.success) setForm(data.data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const { data } = await api.put('/admin/settings/office', {
        ...form,
        graceMinutes: Number(form.graceMinutes),
      });
      if (data.success) {
        setMsg('Office timing saved');
        onSaved?.(data.data.settings);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading office rules...</p>;

  return (
    <form
      onSubmit={handleSave}
      className="bg-[#0D1B2A] rounded-xl p-4 border border-[#C9963A]/30 mb-6"
    >
      <h3 className="text-sm font-semibold text-[#C9963A] mb-3">Office timing & grace</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-400">Office start</label>
          <input
            type="time"
            required
            value={form.officeStart}
            onChange={(e) => setForm({ ...form, officeStart: e.target.value })}
            className="w-full mt-1 text-sm bg-[#1B263B] border border-gray-600 rounded px-2 py-1.5 text-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Office end</label>
          <input
            type="time"
            required
            value={form.officeEnd}
            onChange={(e) => setForm({ ...form, officeEnd: e.target.value })}
            className="w-full mt-1 text-sm bg-[#1B263B] border border-gray-600 rounded px-2 py-1.5 text-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Grace (minutes)</label>
          <input
            type="number"
            min={0}
            max={120}
            required
            value={form.graceMinutes}
            onChange={(e) => setForm({ ...form, graceMinutes: e.target.value })}
            className="w-full mt-1 text-sm bg-[#1B263B] border border-gray-600 rounded px-2 py-1.5 text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full text-sm bg-[#C9963A] text-[#0D1B2A] font-semibold py-2 rounded-lg disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Example: Start 09:30 + 15 min grace → on time until 09:45. After that, late minutes
        show in admin table.
      </p>
      {msg && <p className="text-xs text-green-400 mt-2">{msg}</p>}
    </form>
  );
};

export default OfficeSettingsPanel;
