import prisma from '../prisma.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };

    if (status && ['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Tasks fetched',
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

export const getOneTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task fetched',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const existing = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    const { title, description, status, dueDate } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated',
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const existing = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
