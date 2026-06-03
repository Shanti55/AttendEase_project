import prisma from '../prisma.js';

const statusLabels = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half day',
};

export const notifyAttendanceUpdate = async (userId, employeeName, status, extra = '') => {
  const label = statusLabels[status] || status;
  let message = `Admin updated your attendance for today: marked as ${label}.`;

  if (status === 'HALF_DAY') {
    message =
      'Admin marked you as Half day for today. Please check your attendance details on dashboard.';
  } else if (status === 'ABSENT') {
    message = 'Admin marked you as Absent for today. Contact admin if this is incorrect.';
  } else if (status === 'PRESENT') {
    message = 'Admin marked you as Present for today. Your check-in time has been recorded.';
  }

  if (extra) message += ` ${extra}`;

  await prisma.notification.create({
    data: {
      userId,
      message,
      type: 'ATTENDANCE',
    },
  });
};
