// Saytdagi 5 xil dasturchi mutaxassisligi + "Oddiy foydalanuvchi".
// "Oddiy foydalanuvchi" — saytdan faqat startap g'oyasi joylash yoki
// jamoa qidirish uchun foydalanadigan, o'zi dasturchi bo'lmagan shaxslar uchun.
export const CATEGORIES = [
  { value: 'UI/UX Designer', label: 'UI/UX Dizayner' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Cyber Security Specialist', label: 'Kiber Xavfsizlik Mutaxassisi' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Fullstack Developer', label: 'Fullstack Developer' },
  { value: 'Regular User', label: "Oddiy foydalanuvchi (mutaxassis emas)" },
];

// Startapga "kerakli mutaxassis" qidirilganda faqat shu ro'yxat ishlatiladi
// ("Oddiy foydalanuvchi" jamoa a'zosi bo'la olmaydi)
export const DEVELOPER_CATEGORIES = CATEGORIES.filter((c) => c.value !== 'Regular User');

export const LEVELS = [
  { value: 'Junior', label: 'Junior' },
  { value: 'Senior', label: 'Senior' },
];

export const STARTUP_STAGES = [
  { value: 'Idea', label: "G'oya" },
  { value: 'MVP', label: 'MVP' },
  { value: 'Growth', label: "O'sish bosqichi" },
  { value: 'Launched', label: 'Ishga tushirilgan' },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value;
