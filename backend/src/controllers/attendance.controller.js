import prisma from '../prisma.js';
import { getTodayDate } from '../utils/date.js';
import { findTodayAttendance } from '../utils/attendanceQuery.js';
import {
  getOfficeSettings,
  computeCheckInTiming,
  computeCheckOutTiming,
  attachTimingToRecord,
} from '../utils/officeTiming.js';

export const markAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    const existing = await findTodayAttendance(userId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today',
        data: null,
      });
    }

    const checkIn = new Date();
    const settings = await getOfficeSettings();
    const timing = computeCheckInTiming(checkIn, settings);

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        status: 'PRESENT',
        checkIn,
        lateMinutes: timing.lateMinutes,
        earlyMinutes: timing.earlyMinutes,
      },
    });

    const enriched = await attachTimingToRecord(attendance);

    res.status(201).json({
      success: true,
      message: timing.message,
      data: { attendance: enriched, timing },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today',
        data: null,
      });
    }
    next(err);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });

    const enriched = await Promise.all(records.map((r) => attachTimingToRecord(r)));

    res.status(200).json({
      success: true,
      message: 'Attendance records fetched',
      data: { count: enriched.length, records: enriched },
    });
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const record = await findTodayAttendance(req.user.id);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Mark attendance first before check-out',
        data: null,
      });
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out for today',
        data: null,
      });
    }

    const checkOut = new Date();
    const settings = await getOfficeSettings();
    const outTiming = computeCheckOutTiming(checkOut, settings);

    const attendance = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOut,
        overtimeMinutes: outTiming.overtimeMinutes,
      },
    });

    const enriched = await attachTimingToRecord(attendance);

    res.status(200).json({
      success: true,
      message: outTiming.message || 'Check-out recorded',
      data: { attendance: enriched },
    });
  } catch (err) {
    next(err);
  }
};

export const getAttendanceStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const presentDays = await prisma.attendance.count({
      where: {
        userId: req.user.id,
        status: 'PRESENT',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Attendance stats fetched',
      data: {
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
        presentDays,
        totalDaysInMonth: endOfMonth.getDate(),
      },
    });
  } catch (err) {
    next(err);
  }
};
