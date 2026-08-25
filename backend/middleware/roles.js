const Startup = require('../models/Startup');

// owner - startup.owner bilan teng bo'lgan foydalanuvchi (teamMembers'da saqlanmaydi)
// admin/member - teamMembers[].role'dan olinadi
const getRole = (startup, userId) => {
  if (!startup || !userId) return null;
  const uid = String(userId);
  if (String(startup.owner._id || startup.owner) === uid) return 'owner';
  const membership = startup.teamMembers.find((m) => String(m.user._id || m.user) === uid);
  return membership?.role || null;
};

// actor targetRole'li a'zoni boshqara oladimi (promote/demote/remove)
// owner -> admin/member; admin -> faqat member; member -> hech kimni
const canManageMember = (actorRole, targetRole) => {
  if (actorRole === 'owner') return targetRole !== 'owner';
  if (actorRole === 'admin') return targetRole === 'member';
  return false;
};

// req.params.id yoki req.params.startupId'dan startapni yuklaydi, chaqiruvchining
// rolini hisoblaydi va allowedRoles ichida bo'lmasa 403 qaytaradi.
// Muvaffaqiyatli bo'lsa req.startup va req.callerRole'ni keyingi handler uchun qoldiradi.
const requireRole = (allowedRoles) => async (req, res, next) => {
  try {
    const startupId = req.params.id || req.params.startupId;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startap topilmadi' });

    const role = getRole(startup, req.user._id);
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Bu amal uchun ruxsatingiz yo'q" });
    }

    req.startup = startup;
    req.callerRole = role;
    next();
  } catch (err) {
    next(err);
  }
};

const requireOwner = requireRole(['owner']);

module.exports = { getRole, canManageMember, requireRole, requireOwner };
