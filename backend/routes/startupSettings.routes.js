// Mount: app.use('/api/startups/:startupId', require('./routes/startupSettings.routes'))
const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.use(protect);

// PATCH /startups/:startupId/telegram - owner/admin, ogohlantirishlar uchun Chat ID bog'laydi
router.patch('/telegram', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const { chatId } = req.body;
    req.startup.telegramChatId = chatId || undefined;
    await req.startup.save();
    res.json({ telegramChatId: req.startup.telegramChatId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
