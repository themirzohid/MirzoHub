import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Alert } from '@material-tailwind/react';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import StartupForm from '../components/startup/StartupForm.jsx';
import Loader from '../components/common/Loader.jsx';

const EditStartupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadStartup = useCallback(async () => {
    const { data } = await api.get(`/startups/${id}`);
    setStartup(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadStartup();
  }, [loadStartup]);

  if (isLoading) return <Loader />;
  if (!startup) return null;

  // Egasi bo'lmasa - tahrirlash sahifasiga umuman kirmasin
  if (startup.owner._id !== currentUser?._id) {
    navigate(`/startups/${id}`, { replace: true });
    return null;
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.put(`/startups/${id}`, payload);
      navigate(`/startups/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Typography variant="h4" className="mb-6 dark:text-white">
        Startapni tahrirlash
      </Typography>

      {error && <Alert color="red" className="mb-4">{error}</Alert>}

      <StartupForm
        defaultValues={{
          title: startup.title,
          description: startup.description,
          industry: startup.industry,
          stage: startup.stage,
          website: startup.website,
          tags: startup.tags?.join(', '),
          requiredRoles: startup.requiredRoles,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditStartupPage;
