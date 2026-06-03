import prisma from '../prisma.js';
import { getTodayDate, getTodayBounds, parseLocalTimeToday } from '../utils/date.js';
import {
  findTodayAttendance,
  deleteTodayAttendance,
} from '../utils/attendanceQuery.js';
import {
  getOfficeSettings,
  computeCheckInTiming,
  computeCheckOutTiming,
} from '../utils/officeTiming.js';
import { notifyAttendanceUpdate } from '../utils/notify.js';

const formatTime = (dt) => {
  if (!dt) return null;
  return new Date(dt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const resolveDisplayStatus = (att) => {
  if (!att) return 'ABSENT';
  if (att.status === 'ABSENT') return 'ABSENT';
  if (att.status === 'HALF_DAY') return 'HALF_DAY';
  if (att.checkOut) return 'LEFT';
  return 'PRESENT';
};

// Admin-only: who marked attendance today, check-in/out times
export const getTodayAttendanceOverview = async (req, res, next) => {
  try {
    const today = getTodayDate();
    const { dayStart, dayEnd } = getTodayBounds();
    const officeSettings = await getOfficeSettings();

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });

    const todayRecords = await prisma.attendance.findMany({
      where: {
        OR: [
          { date: today },
          { checkIn: { gte: dayStart, lte: dayEnd } },
        ],
      },
      orderBy: { checkIn: 'desc' },
    });

    // Latest record per employee for today
    const byUserId = new Map();
    for (const r of todayRecords) {
      if (!byUserId.has(r.userId)) byUserId.set(r.userId, r);
    }

    const rows = employees.map((emp) => {
      const att = byUserId.get(emp.id);
      const displayStatus = resolveDisplayStatus(att);
      const loggedOut = Boolean(att?.checkOut);

      let timingNote = '—';
      if (att?.checkIn) {
        const t = computeCheckInTiming(att.checkIn, officeSettings);
        if (t.timingStatus === 'LATE') timingNote = `${t.lateMinutes} min late`;
        else if (t.timingStatus === 'EARLY') timingNote = `${t.earlyMinutes} min early`;
        else timingNote = 'On time';
      }
      if (att?.checkOut && att.overtimeMinutes > 0) {
        timingNote += ` · Out +${att.overtimeMinutes}m`;
      }

      return {
        userId: emp.id,
        name: emp.name,
        email: emp.email,
        recordStatus: att?.status || null,
        marked: displayStatus !== 'ABSENT',
        checkIn: att?.checkIn || null,
        checkOut: att?.checkOut || null,
        checkInTime: formatTime(att?.checkIn),
        checkOutTime: formatTime(att?.checkOut),
        lateMinutes: att?.lateMinutes ?? 0,
        earlyMinutes: att?.earlyMinutes ?? 0,
        timingNote,
        loggedOut,
        status: displayStatus,
      };
    });

    const summary = {
      totalEmployees: employees.length,
      present: rows.filter((r) => ['PRESENT', 'LEFT'].includes(r.status)).length,
      halfDay: rows.filter((r) => r.status === 'HALF_DAY').length,
      absent: rows.filter((r) => r.status === 'ABSENT').length,
      late: rows.filter((r) => r.lateMinutes > 0).length,
      stillIn: rows.filter((r) => ['PRESENT', 'HALF_DAY'].includes(r.status) && !r.loggedOut)
        .length,
      loggedOut: rows.filter((r) => r.loggedOut).length,
    };

    res.status(200).json({
      success: true,
      message: 'Today attendance overview',
      data: {
        date: today,
        officeSettings,
        summary,
        rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin manually set Present / Absent / Half-day (+ optional times)
export const setManualAttendance = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { status, checkInTime, checkOutTime } = req.body;

    const employee = await prisma.user.findFirst({
      where: { id: userId, role: 'EMPLOYEE' },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
        data: null,
      });
    }

    if (status === 'ABSENT') {
      await deleteTodayAttendance(userId);
      await notifyAttendanceUpdate(userId, employee.name, 'ABSENT');
      return res.status(200).json({
        success: true,
        message: `${employee.name} marked absent for today`,
        data: null,
      });
    }

    const today = getTodayDate();
    const settings = await getOfficeSettings();
    const checkIn = parseLocalTimeToday(checkInTime) || new Date();
    let checkOut = parseLocalTimeToday(checkOutTime);

    if (status === 'HALF_DAY' && !checkOut) {
      checkOut = parseLocalTimeToday('13:00');
    }

    const inTiming = computeCheckInTiming(checkIn, settings);
    let overtimeMinutes = 0;
    if (checkOut) {
      overtimeMinutes = computeCheckOutTiming(checkOut, settings).overtimeMinutes;
    }

    const payload = {
      date: today,
      status,
      checkIn,
      checkOut: checkOut || null,
      lateMinutes: inTiming.lateMinutes,
      earlyMinutes: inTiming.earlyMinutes,
      overtimeMinutes,
    };

    const existing = await findTodayAttendance(userId);
    let attendance;

    if (existing) {
      attendance = await prisma.attendance.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      attendance = await prisma.attendance.create({
        data: { userId, ...payload },
      });
    }

    const timeExtra =
      inTiming.timingStatus === 'LATE'
        ? `You were ${inTiming.lateMinutes} min late.`
        : '';

    await notifyAttendanceUpdate(userId, employee.name, status, timeExtra);

    res.status(200).json({
      success: true,
      message: `${employee.name} marked as ${status}. Employee notified.`,
      data: { attendance },
    });
  } catch (err) {
    next(err);
  }
};
