export const MEMBER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: "A'zo" },
];

export const ROLE_LABELS = { owner: 'Egasi', admin: 'Admin', member: "A'zo" };
export const ROLE_COLORS = { owner: 'purple', admin: 'blue', member: 'blue-gray' };

// owner - startup.owner bilan teng bo'lgan foydalanuvchi (teamMembers ichida saqlanmaydi)
// admin/member - teamMembers[].role dan olinadi
export const getStartupRole = (startup, currentUser) => {
  if (!startup || !currentUser) return null;
  if (startup.owner?._id === currentUser._id) return 'owner';
  const membership = startup.teamMembers?.find((m) => m.user?._id === currentUser._id);
  return membership?.role || null;
};

// actor targetRole'li a'zoni boshqara oladimi (promote/demote/remove)
// owner -> admin/member; admin -> faqat member; member -> hech kimni
export const canManageMember = (actorRole, targetRole) => {
  if (actorRole === 'owner') return targetRole !== 'owner';
  if (actorRole === 'admin') return targetRole === 'member';
  return false;
};
