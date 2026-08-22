import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuHandler, MenuList, MenuItem, IconButton } from '@material-tailwind/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore.js';
import { useTranslation } from '../../hooks/useTranslation.js';
import NotificationBell from '../notifications/NotificationBell.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-bordo-400' : 'text-xaki-100/90 hover:text-bordo-300'
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore((s) => ({
    user: s.user,
    logout: s.logout,
    isAuthenticated: s.isAuthenticated(),
  }));

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: '/', end: true, label: t('nav.startups') },
    { to: '/developers', label: t('nav.developers') },
    { to: '/about', label: t('nav.about') },
  ];
  const authLinks = [
    { to: '/requests', label: t('nav.requests') },
    { to: '/messages', label: t('nav.messages') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-siyoh-900">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-extrabold tracking-tight text-bordo-400">
          MirzoHub
        </Link>

        {/* Desktop navigatsiya - faqat lg va undan katta ekranlarda */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated &&
            authLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
        </div>

        {/* O'ng tomon: til, tema, profil - planshet/desktopda to'liq, mobil'da qisqartirilgan */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
                    alt={user?.fullName}
                    className="cursor-pointer ring-2 ring-xaki-400/40"
                  />
                </MenuHandler>
                <MenuList className="dark:border-siyoh-700 dark:bg-siyoh-800">
                  <MenuItem onClick={() => navigate('/profile/me')} className="dark:text-xaki-50 dark:hover:bg-siyoh-700">
                    {t('nav.profile')}
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/startups/new')} className="dark:text-xaki-50 dark:hover:bg-siyoh-700">
                    {t('nav.createStartup')}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="text-red-500">
                    {t('nav.logout')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="text" size="sm" className="text-xaki-100" onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button size="sm" className="bg-bordo-600 text-white" onClick={() => navigate('/register')}>
                {t('nav.register')}
              </Button>
            </div>
          )}

          {/* Hamburger - faqat lg dan kichik ekranlarda */}
          <IconButton
            variant="text"
            className="text-xaki-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Menyu"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </IconButton>
        </div>
      </nav>

      {/* Mobil/planshet ochiladigan menyu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-siyoh-900 px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-white/5 text-bordo-400' : 'text-xaki-100/90'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated &&
              authLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-white/5 text-bordo-400' : 'text-xaki-100/90'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <LanguageSwitcher />
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Button
                  variant="text"
                  size="sm"
                  className="text-xaki-100"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/login');
                  }}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  size="sm"
                  className="bg-bordo-600 text-white"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/register');
                  }}
                >
                  {t('nav.register')}
                </Button>
              </div>
            ) : (
              <NotificationBell />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
