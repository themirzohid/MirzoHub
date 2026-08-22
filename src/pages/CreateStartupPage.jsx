import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Alert } from '@material-tailwind/react';
import api from '../lib/axios.js';
import StartupForm from '../components/startup/StartupForm.jsx';

const CreateStartupPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post('/startups', payload);
      navigate(`/startups/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Typography variant="h4" className="mb-1 dark:text-white">
        Startap g'oyangizni e'lon qiling
      </Typography>
      <Typography variant="small" className="mb-6 text-siyoh-500 dark:text-xaki-300">
        Kerakli mutaxassislar bo'limini to'ldirish shart emas — keyinroq ham qo'shishingiz mumkin.
      </Typography>

      {error && <Alert color="red" className="mb-4">{error}</Alert>}

      <StartupForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateStartupPage;
