import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.js';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-xaki-200 bg-white dark:border-siyoh-700 dark:bg-siyoh-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-bordo-600 dark:text-bordo-400">MirzoHub</p>
          <p className="mt-2 max-w-xs text-sm text-siyoh-500 dark:text-xaki-200">{t('footer.tagline')}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-siyoh-800 dark:text-white">{t('footer.product')}</p>
          <div className="flex flex-col gap-2 text-sm text-siyoh-500 dark:text-xaki-200">
            <Link to="/" className="hover:text-bordo-600 dark:hover:text-bordo-400">
              {t('nav.startups')}
            </Link>
            <Link to="/developers" className="hover:text-bordo-600 dark:hover:text-bordo-400">
              {t('nav.developers')}
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-siyoh-800 dark:text-white">{t('footer.company')}</p>
          <div className="flex flex-col gap-2 text-sm text-siyoh-500 dark:text-xaki-200">
            <Link to="/about" className="hover:text-bordo-600 dark:hover:text-bordo-400">
              {t('nav.about')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-xaki-200 px-4 py-4 text-center text-xs text-siyoh-400 dark:border-siyoh-700 dark:text-xaki-300">
        © {new Date().getFullYear()} MirzoHub — {t('footer.rights')} · {t('footer.madeBy')}
      </div>
    </footer>
  );
};

export default Footer;
