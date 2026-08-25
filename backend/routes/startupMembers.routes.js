// Bu handlerlarni mavjud routes/startups.js faylingizga qo'shing
// (yoki shu faylni /api/startups ostiga alohida mount qiling).
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireRole, requireOwner, canManageMember } = require('../middleware/roles');

router.use(protect);

// PATCH /startups/:id/members/:userId/role - owner yoki admin
router.patch('/:id/members/:userId/role', requireRole(['owner', 'admin']), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: "Noto'g'ri rol" });
    }

    const target = req.startup.teamMembers.find((m) => String(m.user) === req.params.userId);
    if (!target) return res.status(404).json({ message: "A'zo topilmadi" });

    if (!canManageMember(req.callerRole, target.role)) {
      return res.status(403).json({ message: "Bu a'zoni boshqarish uchun ruxsatingiz yo'q" });
    }

    target.role = role;
    await req.startup.save();
    res.json(req.startup);
  } catch (err) {
    next(err);
  }
});

// DELETE /startups/:id/members/:userId - owner/admin (canManageMember orqali)
// yoki o'zini o'zi chiqarish (userId === req.user._id)
router.delete('/:id/members/:userId', requireRole(['owner', 'admin', 'member']), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const isSelf = userId === String(req.user._id);

    const target = req.startup.teamMembers.find((m) => String(m.user) === userId);
    if (!target) return res.status(404).json({ message: "A'zo topilmadi" });

    if (!isSelf && !canManageMember(req.callerRole, target.role)) {
      return res.status(403).json({ message: "Bu a'zoni chiqarish uchun ruxsatingiz yo'q" });
    }

    req.startup.teamMembers = req.startup.teamMembers.filter((m) => String(m.user) !== userId);
    await req.startup.save();
    res.json({ message: "A'zo jamoadan chiqarildi" });
  } catch (err) {
    next(err);
  }
});

// DELETE /startups/:id - faqat owner (avval owner-yoki-admin edi, endi tighten qilindi)
router.delete('/:id', requireOwner, async (req, res, next) => {
  try {
    await req.startup.deleteOne();
    res.json({ message: "Startap o'chirildi" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
