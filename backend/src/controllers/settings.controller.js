import { getOfficeSettings } from '../utils/officeTiming.js';
import prisma from '../prisma.js';

export const getOfficeSettingsPublic = async (req, res, next) => {
  try {
    const settings = await getOfficeSettings();
    res.status(200).json({
      success: true,
      message: 'Office settings',
      data: { settings },
    });
  } catch (err) {
    next(err);
  }
};

export const updateOfficeSettings = async (req, res, next) => {
  try {
    const { officeStart, officeEnd, graceMinutes } = req.body;

    const settings = await prisma.officeSettings.upsert({
      where: { id: 1 },
      update: { officeStart, officeEnd, graceMinutes },
      create: { id: 1, officeStart, officeEnd, graceMinutes },
    });

    res.status(200).json({
      success: true,
      message: 'Office timing updated',
      data: { settings },
    });
  } catch (err) {
    next(err);
  }
};
