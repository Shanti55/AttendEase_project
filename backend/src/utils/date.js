const TZ = process.env.TZ || 'Asia/Kolkata';

const todayString = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: TZ });

/** Calendar date stored in DB (@db.Date) */
export const getTodayDate = () => {
  const dateStr = todayString();
  return new Date(`${dateStr}T00:00:00.000Z`);
};

/** Start/end of today in IST for querying checkIn / checkOut */
export const getTodayBounds = () => {
  const dateStr = todayString();
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);
  return { dayStart, dayEnd, today: getTodayDate(), dateStr };
};

/** "09:30" or "09:30:00" → today in local (IST) */
export const parseLocalTimeToday = (timeStr) => {
  if (!timeStr) return null;
  if (timeStr.includes('T')) return new Date(timeStr);

  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const d = new Date();
  d.setHours(Number(match[1]), Number(match[2]), Number(match[3] || 0), 0);
  return d;
};

export const formatTimeHHMM = (dt) => {
  if (!dt) return '';
  return new Date(dt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
