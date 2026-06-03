import prisma from '../prisma.js';
import { parseLocalTimeToday } from './date.js';

export const getOfficeSettings = async () => {
  let settings = await prisma.officeSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    settings = await prisma.officeSettings.create({
      data: {
        id: 1,
        officeStart: '09:30',
        officeEnd: '18:30',
        graceMinutes: 15,
      },
    });
  }

  return settings;
};

const formatHHMM = (timeStr) => {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

/** Check-in vs office start + grace */
export const computeCheckInTiming = (checkIn, settings) => {
  const officeStart = parseLocalTimeToday(settings.officeStart);
  const graceEnd = new Date(
    officeStart.getTime() + settings.graceMinutes * 60 * 1000
  );
  const at = new Date(checkIn);

  let timingStatus = 'ON_TIME';
  let lateMinutes = 0;
  let earlyMinutes = 0;

  if (at < officeStart) {
    earlyMinutes = Math.ceil((officeStart - at) / 60000);
    timingStatus = 'EARLY';
  } else if (at > graceEnd) {
    lateMinutes = Math.ceil((at - graceEnd) / 60000);
    timingStatus = 'LATE';
  }

  const checkInTime = at.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let message = `Checked in at ${checkInTime}`;
  if (timingStatus === 'EARLY') {
    message += ` (${earlyMinutes} min early — office opens ${formatHHMM(settings.officeStart)})`;
  } else if (timingStatus === 'LATE') {
    message += ` — ${lateMinutes} min late (grace ${settings.graceMinutes} min after ${formatHHMM(settings.officeStart)})`;
  } else {
    message += ' — On time';
  }

  return {
    timingStatus,
    lateMinutes,
    earlyMinutes,
    message,
    graceEndsAt: graceEnd.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

/** Check-out after office end */
export const computeCheckOutTiming = (checkOut, settings) => {
  const officeEnd = parseLocalTimeToday(settings.officeEnd);
  const at = new Date(checkOut);

  if (at <= officeEnd) {
    return { overtimeMinutes: 0, message: null };
  }

  const overtimeMinutes = Math.ceil((at - officeEnd) / 60000);
  const outTime = at.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    overtimeMinutes,
    message: `Checked out at ${outTime} — ${overtimeMinutes} min after office end (${formatHHMM(settings.officeEnd)})`,
  };
};

export const attachTimingToRecord = async (attendance) => {
  if (!attendance?.checkIn) return attendance;

  const settings = await getOfficeSettings();
  const checkInInfo = computeCheckInTiming(attendance.checkIn, settings);
  let checkoutInfo = { overtimeMinutes: attendance.overtimeMinutes || 0, message: null };

  if (attendance.checkOut) {
    checkoutInfo = computeCheckOutTiming(attendance.checkOut, settings);
  }

  return {
    ...attendance,
    timingStatus: checkInInfo.timingStatus,
    lateMinutes: attendance.lateMinutes ?? checkInInfo.lateMinutes,
    earlyMinutes: attendance.earlyMinutes ?? checkInInfo.earlyMinutes,
    timingMessage: checkInInfo.message,
    checkoutMessage: checkoutInfo.message,
    officeHours: {
      start: settings.officeStart,
      end: settings.officeEnd,
      graceMinutes: settings.graceMinutes,
    },
  };
};
