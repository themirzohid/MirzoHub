import { useUiStore } from '../store/uiStore.js';
import { translations } from '../i18n/translations.js';

// Ichma-ich kalitni o'qish uchun: t('home.heroTitleA')
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function useTranslation() {
  const language = useUiStore((s) => s.language);
  const setLanguage = useUiStore((s) => s.setLanguage);

  const t = (key) => {
    const value = getNestedValue(translations[language], key);
    // Tarjima topilmasa, kalitning o'zini ko'rsatamiz - shunda
    // ekranda bo'sh joy qolmaydi, xato darhol ko'zga tashlanadi
    return value ?? key;
  };

  return { t, language, setLanguage };
}
