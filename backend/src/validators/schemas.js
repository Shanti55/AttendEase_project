import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

const timeHHMM = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm format (e.g. 09:30)');

export const officeSettingsSchema = z.object({
  officeStart: timeHHMM,
  officeEnd: timeHHMM,
  graceMinutes: z.coerce.number().int().min(0).max(120),
});

export const adminAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY']),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: z.string().optional().nullable(),
});
