import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Card, CardBody } from '@material-tailwind/react';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { CATEGORIES } from '../constants/categories.js';
import { CATEGORY_ICONS } from '../constants/categoryIcons.js';
import StartupFilter from '../components/startup/StartupFilter.jsx';
import StartupCard from '../components/startup/StartupCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

function getPlaceholderImage(seed, width = 800, height = 600) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

// ---------------------------------------------------------------------------
// QISM-KOMPONENTLAR
// ---------------------------------------------------------------------------

function HeroSection({ t }) {
  return (
    <section className="relative -mx-4 overflow-hidden bg-siyoh-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-24 pt-14 lg:grid-cols-2 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <span className="mb-4 inline-block rounded-full bg-bordo-500/15 px-4 py-1.5 text-xs font-semibold text-bordo-300">
            {t('home.heroTag')}
          </span>
          <Typography variant="h1" className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {t('home.heroTitleA')} <span className="text-bordo-400">{t('home.heroTitleB')}</span>{' '}
            {t('home.heroTitleC')}
          </Typography>
          <Typography className="mt-4 max-w-lg text-lg text-xaki-100/80">{t('home.heroText')}</Typography>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="bg-bordo-600 text-white hover:shadow-lg hover:shadow-bordo-600/30">
                {t('home.ctaStart')}
              </Button>
            </Link>
            <a href="#browse-startups">
              <Button variant="outlined" className="border-xaki-300 text-xaki-100">
                {t('home.ctaBrowse')}
              </Button>
            </a>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <img
            src={getPlaceholderImage('mirzohub-hero', 800, 600)}
            alt="Jamoa bo'lib ishlayotgan dasturchilar"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl ring-4 ring-xaki-400/20"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bordo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-xaki-500/10 blur-3xl" />
    </section>
  );
}

function StatsSection({ t, startupsTotal, developersTotal }) {
  const stats = [
    { value: startupsTotal ?? '—', label: t('home.statStartups') },
    { value: developersTotal ?? '—', label: t('home.statDevelopers') },
    { value: CATEGORIES.length - 1, label: t('home.statCategories') },
    { value: '24/7', label: t('home.statMatches') },
  ];

  return (
    <div className="relative -mx-4 -mt-16 px-4 lg:-mt-14">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-xaki-200 bg-white shadow-lg dark:border-siyoh-700 dark:bg-siyoh-800">
            <CardBody className="py-5 text-center">
              <p className="text-2xl font-extrabold text-bordo-600 dark:text-bordo-400">{stat.value}</p>
              <p className="mt-1 text-xs text-siyoh-500 dark:text-xaki-300">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WhySection({ t }) {
  const items = [
    { title: t('home.why1Title'), text: t('home.why1Text'), icon: UserGroupIcon },
    { title: t('home.why2Title'), text: t('home.why2Text'), icon: ChatBubbleLeftRightIcon },
    { title: t('home.why3Title'), text: t('home.why3Text'), icon: FunnelIcon },
  ];

  return (
    <section className="mx-auto mt-20 max-w-6xl">
      <Typography variant="h3" className="text-center text-siyoh-800 dark:text-white">
        {t('home.whyTitle')}
      </Typography>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-xaki-200 p-5 dark:border-siyoh-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-siyoh-800 text-bordo-400 dark:bg-siyoh-700">
              <item.icon className="h-6 w-6" />
            </div>
            <Typography variant="h6" className="mt-3 text-siyoh-800 dark:text-white">
              {item.title}
            </Typography>
            <Typography variant="small" className="mt-1 text-siyoh-500 dark:text-xaki-300">
              {item.text}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection({ t }) {
  const developerCategories = CATEGORIES.filter((c) => c.value !== 'Regular User');

  return (
    <section className="mx-auto mt-20 max-w-6xl">
      <div className="text-center">
        <Typography variant="h3" className="text-siyoh-800 dark:text-white">
          {t('home.categoriesTitle')}
        </Typography>
        <Typography className="mt-2 text-siyoh-500 dark:text-xaki-300">{t('home.categoriesSubtitle')}</Typography>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {developerCategories.map((category) => (
          <Link
            key={category.value}
            to={`/developers?category=${encodeURIComponent(category.value)}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-xaki-200 p-4 text-center transition-colors hover:border-bordo-400 hover:bg-bordo-50 dark:border-siyoh-700 dark:hover:border-bordo-500 dark:hover:bg-siyoh-800"
          >
            <span className="text-2xl">{CATEGORY_ICONS[category.value]}</span>
            <p className="text-xs font-medium text-siyoh-700 dark:text-xaki-100">{category.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BrowseStartupsSection({ t, isAuthenticated, filters, setFilters, startups, isLoading }) {
  return (
    <section id="browse-startups" className="mx-auto mt-20 max-w-6xl scroll-mt-20">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Typography variant="h3" className="text-siyoh-800 dark:text-white">
          {t('home.featuredTitle')}
        </Typography>
        {isAuthenticated && (
          <Link to="/startups/new">
            <Button className="flex items-center gap-2 bg-bordo-600 text-white">
              <PlusIcon className="h-4 w-4" /> {t('nav.createStartup')}
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-5">
        <StartupFilter filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <Loader />
        ) : startups.length === 0 ? (
          <EmptyState title={t('home.featuredEmpty')} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {startups.map((s) => (
              <StartupCard key={s._id} startup={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection({ t }) {
  return (
    <section className="-mx-4 mt-20 bg-bordo-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center text-white">
        <Typography variant="h3" className="text-white">
          {t('home.ctaSectionTitle')}
        </Typography>
        <Typography className="max-w-xl text-bordo-50">{t('home.ctaSectionText')}</Typography>
        <Link to="/register">
          <Button className="mt-2 bg-siyoh-900 hover:bg-siyoh-800">{t('nav.register')}</Button>
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ASOSIY KOMPONENT
// ---------------------------------------------------------------------------

const HomePage = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [filters, setFilters] = useState({});
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startupsTotal, setStartupsTotal] = useState(null);
  const [developersTotal, setDevelopersTotal] = useState(null);

  const loadStartups = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/startups', { params });
      setStartups(data.startups);
      setStartupsTotal((prev) => (Object.keys(params).length ? prev : data.total));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  // Statistika bar uchun umumiy dasturchilar sonini bir marta olamiz
  useEffect(() => {
    api.get('/users', { params: { limit: 1 } }).then(({ data }) => setDevelopersTotal(data.total));
  }, []);

  return (
    <div className="-mt-6 flex flex-col">
      <HeroSection t={t} />
      <StatsSection t={t} startupsTotal={startupsTotal} developersTotal={developersTotal} />
      <WhySection t={t} />
      <CategoriesSection t={t} />
      <BrowseStartupsSection
        t={t}
        isAuthenticated={isAuthenticated}
        filters={filters}
        setFilters={setFilters}
        startups={startups}
        isLoading={isLoading}
      />
      <CtaSection t={t} />
    </div>
  );
};

export default HomePage;
