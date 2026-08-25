// Mount: app.use('/api/startups/:startupId/meetings', require('./routes/meetings.routes'))
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { dispatchUrgentAlert } = require('../services/alertDispatcher');

router.use(protect);

// GET /startups/:startupId/meetings
router.get('/', requireRole(['owner', 'admin', 'member']), async (req, res) => {
  res.json(req.startup.meetings);
});

// POST /startups/:startupId/meetings - faqat owner/admin
router.post('/', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const { title, platform, url, scheduledAt } = req.body;
    if (!title || !url || !scheduledAt) {
      return res.status(400).json({ message: 'title, url va scheduledAt talab qilinadi' });
    }
    if (!['zoom', 'google_meet', 'other'].includes(platform)) {
      return res.status(400).json({ message: "Noto'g'ri platforma" });
    }

    req.startup.meetings.push({ title, platform, url, scheduledAt, createdBy: req.user._id });
    await req.startup.save();
    const meeting = req.startup.meetings[req.startup.meetings.length - 1];

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('meetingCreated', meeting);

    const memberIds = [req.startup.owner, ...req.startup.teamMembers.map((m) => m.user)];
    const recipients = await User.find({ _id: { $in: memberIds } }).select('email');

    dispatchUrgentAlert({
      io: req.app.get('io'),
      startup: req.startup,
      title: `Yangi uchrashuv: ${meeting.title}`,
      message: `${new Date(meeting.scheduledAt).toLocaleString('uz-UZ')} da boshlanadi: ${meeting.url}`,
      recipients,
    }).catch((err) => console.error('Alert dispatch failed:', err.message));

    res.status(201).json(meeting);
  } catch (err) {
    next(err);
  }
});

// DELETE /startups/:startupId/meetings/:meetingId - faqat owner/admin
router.delete('/:meetingId', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const meeting = req.startup.meetings.id(req.params.meetingId);
    if (!meeting) return res.status(404).json({ message: 'Uchrashuv topilmadi' });

    meeting.deleteOne();
    await req.startup.save();

    req.app.get('io')?.to(`startup:${req.startup._id}`).emit('meetingDeleted', { meetingId: req.params.meetingId });
    res.json({ message: "Uchrashuv o'chirildi" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
