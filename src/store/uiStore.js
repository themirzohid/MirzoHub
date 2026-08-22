import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Brauzer tilini aniqlab, mos keladigan standart tilni tanlaydi
function detectDefaultLanguage() {
  const browserLang = navigator.language?.slice(0, 2);
  if (['uz', 'ru', 'en'].includes(browserLang)) return browserLang;
  return 'uz';
}

export const useUiStore = create(
  persist(
    (set, get) => ({
      language: detectDefaultLanguage(), // 'uz' | 'ru' | 'en'
      theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',

      setLanguage: (language) => set({ language }),

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
      },

      // Sahifa birinchi ochilganda <html> elementiga dark klassini qo'yish
      applyThemeToDocument: () => {
        document.documentElement.classList.toggle('dark', get().theme === 'dark');
      },
    }),
    { name: 'mirzohub-ui' }
  )
);
