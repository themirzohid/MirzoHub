export const MEMBER_PERMISSIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: "A'zo" },
];

export const PERMISSION_LABELS = { owner: 'Egasi', admin: 'Admin', member: "A'zo" };
export const PERMISSION_COLORS = { owner: 'purple', admin: 'blue', member: 'blue-gray' };

// Diqqat: backendda teamMembers[].role - mutaxassislik (masalan "Frontend Developer"),
// teamMembers[].permission - RBAC darajasi. Bu ikkalasi butunlay boshqa maydonlar.
// owner - startup.owner bilan teng bo'lgan foydalanuvchi (lekin backend uni
// teamMembers ichiga ham default permission='member' bilan qo'shadi - shuning
// uchun bu funksiya owner tekshiruvini teamMembers'dan OLDIN qiladi).
export const getStartupPermission = (startup, currentUser) => {
  if (!startup || !currentUser) return null;
  if (startup.owner?._id === currentUser._id) return 'owner';
  const membership = startup.teamMembers?.find((m) => m.user?._id === currentUser._id);
  return membership?.permission || null;
};

// actor targetPermission'li a'zoni boshqara oladimi (promote/demote/remove)
// owner -> admin/member; admin -> faqat member; member -> hech kimni
export const canManageMember = (actorPermission, targetPermission) => {
  if (actorPermission === 'owner') return targetPermission !== 'owner';
  if (actorPermission === 'admin') return targetPermission === 'member';
  return false;
};
