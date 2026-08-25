// Mount: app.use('/api/startups/:startupId/tasks', require('./routes/tasks.routes'))
const express = require('express');
const router = express.Router({ mergeParams: true });
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { dispatchUrgentAlert } = require('../services/alertDispatcher');

router.use(protect);

const isTeamMember = (startup, userId) =>
  String(startup.owner) === String(userId) ||
  startup.teamMembers.some((m) => String(m.user) === String(userId));

// GET /startups/:startupId/tasks
router.get('/', requireRole(['owner', 'admin', 'member']), async (req, res, next) => {
  try {
    const tasks = await Task.find({ startupId: req.startup._id })
      .populate('assignedTo', 'fullName avatar email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /startups/:startupId/tasks - faqat owner/admin
router.post('/', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Sarlavha talab qilinadi' });
    if (assignedTo && !isTeamMember(req.startup, assignedTo)) {
      return res.status(400).json({ message: "Tayinlangan foydalanuvchi jamoa a'zosi emas" });
    }

    const task = await Task.create({
      startupId: req.startup._id,
      title,
      description,
      assignedTo: assignedTo || undefined,
      priority: priority || 'medium',
      dueDate: dueDate || undefined,
    });
    await task.populate('assignedTo', 'fullName avatar email');

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('taskCreated', task);

    if (task.priority === 'urgent' && task.assignedTo) {
      dispatchUrgentAlert({
        io: req.app.get('io'),
        startup: req.startup,
        title: `Shoshilinch vazifa: ${task.title}`,
        message: task.description || 'Sizga shoshilinch vazifa tayinlandi',
        recipients: [task.assignedTo],
      }).catch((err) => console.error('Alert dispatch failed:', err.message));
    }

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PATCH /startups/:startupId/tasks/:taskId - to'liq tahrirlash, faqat owner/admin
router.patch('/:taskId', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, startupId: req.startup._id });
    if (!task) return res.status(404).json({ message: 'Vazifa topilmadi' });

    const { title, description, assignedTo, priority, dueDate, status } = req.body;
    if (assignedTo !== undefined) {
      if (assignedTo && !isTeamMember(req.startup, assignedTo)) {
        return res.status(400).json({ message: "Tayinlangan foydalanuvchi jamoa a'zosi emas" });
      }
      task.assignedTo = assignedTo || undefined;
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    const wasUrgent = task.priority === 'urgent';
    if (priority !== undefined) task.priority = priority;

    await task.save();
    await task.populate('assignedTo', 'fullName avatar email');

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('taskUpdated', task);

    if (!wasUrgent && task.priority === 'urgent' && task.assignedTo) {
      dispatchUrgentAlert({
        io: req.app.get('io'),
        startup: req.startup,
        title: `Shoshilinch vazifa: ${task.title}`,
        message: task.description || 'Sizga shoshilinch vazifa tayinlandi',
        recipients: [task.assignedTo],
      }).catch((err) => console.error('Alert dispatch failed:', err.message));
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PATCH /startups/:startupId/tasks/:taskId/status - tayinlangan a'zo yoki owner/admin
router.patch('/:taskId/status', requireRole(['owner', 'admin', 'member']), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ message: "Noto'g'ri holat" });
    }

    const task = await Task.findOne({ _id: req.params.taskId, startupId: req.startup._id });
    if (!task) return res.status(404).json({ message: 'Vazifa topilmadi' });

    const isManager = req.callerRole === 'owner' || req.callerRole === 'admin';
    const isAssignee = task.assignedTo && String(task.assignedTo) === String(req.user._id);
    if (!isManager && !isAssignee) {
      return res.status(403).json({ message: "Bu vazifani o'zgartirish uchun ruxsatingiz yo'q" });
    }

    task.status = status;
    await task.save();
    await task.populate('assignedTo', 'fullName avatar email');

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /startups/:startupId/tasks/:taskId - faqat owner/admin
router.delete('/:taskId', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, startupId: req.startup._id });
    if (!task) return res.status(404).json({ message: 'Vazifa topilmadi' });

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('taskDeleted', { taskId: task._id });
    res.json({ message: "Vazifa o'chirildi" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
