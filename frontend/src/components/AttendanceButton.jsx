const AttendanceButton = ({
  markedToday,
  checkedOut,
  loading,
  checkoutLoading,
  onMark,
  onCheckout,
  stats,
  officeHours,
  timingMessage,
  checkoutMessage,
}) => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-[#0D1B2A] mb-1">Attendance</h2>
      <p className="text-sm text-gray-500 mb-2">{today}</p>

      {officeHours && (
        <p className="text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          Office: {officeHours.start} – {officeHours.end} · Grace: {officeHours.graceMinutes} min
          <span className="block text-gray-400 mt-0.5">
            Early check-in OK. After start + grace = late minutes shown.
          </span>
        </p>
      )}

      {stats && (
        <p className="text-sm text-gray-600 mb-4">
          This month: <strong className="text-[#0D1B2A]">{stats.presentDays}</strong> days present
        </p>
      )}

      {!markedToday ? (
        <button
          onClick={onMark}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition shadow-md"
        >
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      ) : checkedOut ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl py-3 font-medium">
            <span className="text-xl">✓</span>
            Attendance Marked
          </div>
          <div className="text-center text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-xl py-3">
            {checkoutMessage || 'Checked out for today'}
          </div>
          {timingMessage && (
            <p className="text-xs text-center text-gray-600">{timingMessage}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl py-3 font-medium">
            <span className="text-xl">✓</span>
            Attendance Marked
          </div>
          {timingMessage && (
            <p
              className={`text-sm text-center rounded-lg px-3 py-2 border ${
                timingMessage.includes('late')
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {timingMessage}
            </p>
          )}
          <button
            onClick={onCheckout}
            disabled={checkoutLoading}
            className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
          >
            {checkoutLoading ? 'Checking out...' : 'Check Out (Leave)'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Logout button also saves your leave time for admin
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceButton;
