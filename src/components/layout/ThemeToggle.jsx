import { IconButton } from '@material-tailwind/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useUiStore } from '../../store/uiStore.js';

const ThemeToggle = () => {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <IconButton
      variant="text"
      className="text-xaki-100 hover:bg-white/5"
      onClick={toggleTheme}
      aria-label="Tema almashtirish"
    >
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </IconButton>
  );
};

export default ThemeToggle;
