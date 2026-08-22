import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';
import api from '../lib/axios.js';
import DeveloperFilter from '../components/developer/DeveloperFilter.jsx';
import DeveloperCard from '../components/developer/DeveloperCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const DevelopersPage = () => {
  const [searchParams] = useSearchParams();

  // HomePage'dagi "Kimlar uchun?" bo'limidan kelgan ?category=... havolasini
  // boshlang'ich filtr sifatida o'qiymiz (masalan: /developers?category=Backend Developer)
  const [filters, setFilters] = useState({ category: searchParams.get('category') || '' });
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDevelopers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries({ ...filters, tech: filters.search }).filter(([, v]) => v)
      );
      const { data } = await api.get('/users', { params });
      setDevelopers(data.users);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h4" className="text-siyoh-800 dark:text-white">
          Dasturchilar
        </Typography>
        <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
          Kategoriya va daraja bo'yicha filtrlab, jamoangizga mos mutaxassisni toping
        </Typography>
      </div>

      <DeveloperFilter filters={filters} onChange={setFilters} />

      {isLoading ? (
        <Loader />
      ) : developers.length === 0 ? (
        <EmptyState title="Mos dasturchi topilmadi" description="Filtrni o'zgartirib ko'ring." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {developers.map((dev) => (
            <DeveloperCard key={dev._id} developer={dev} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DevelopersPage;
