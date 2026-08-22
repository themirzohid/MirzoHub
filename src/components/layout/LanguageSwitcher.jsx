import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { useTranslation } from '../../hooks/useTranslation.js';

const LANGUAGES = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Button
          size="sm"
          variant="text"
          className="min-w-[64px] px-2 text-xaki-100 hover:bg-white/5"
        >
          {current?.code.toUpperCase()}
        </Button>
      </MenuHandler>
      <MenuList className="dark:border-siyoh-700 dark:bg-siyoh-800">
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`dark:text-xaki-50 dark:hover:bg-siyoh-700 ${
              lang.code === language ? 'font-semibold text-bordo-600 dark:text-bordo-400' : ''
            }`}
          >
            {lang.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
