import prisma from '../prisma.js';
import { getTodayBounds } from './date.js';

/** Find today's attendance row (works with old + new date records) */
export const findTodayAttendance = async (userId) => {
  const { dayStart, dayEnd, today } = getTodayBounds();

  return prisma.attendance.findFirst({
    where: {
      userId,
      OR: [
        { date: today },
        { checkIn: { gte: dayStart, lte: dayEnd } },
      ],
    },
    orderBy: { checkIn: 'desc' },
  });
};

export const deleteTodayAttendance = async (userId) => {
  const { dayStart, dayEnd, today } = getTodayBounds();

  await prisma.attendance.deleteMany({
    where: {
      userId,
      OR: [{ date: today }, { checkIn: { gte: dayStart, lte: dayEnd } }],
    },
  });
};
