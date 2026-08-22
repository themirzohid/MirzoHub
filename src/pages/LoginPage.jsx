import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardBody, Input, Button, Typography, Alert } from '@material-tailwind/react';
import { useAuthStore } from '../store/authStore.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10">
      <Card className="w-full border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" className="dark:text-white">
            Xush kelibsiz
          </Typography>
          <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
            Jamoa qidirish yoki qo'shilish uchun hisobingizga kiring
          </Typography>

          {error && <Alert color="red">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              className="dark:text-white"
              labelProps={{ className: 'dark:text-xaki-300' }}
              {...register('email', { required: 'Email kiritilishi shart' })}
              error={!!errors.email}
            />
            <Input
              label="Parol"
              type="password"
              className="dark:text-white"
              labelProps={{ className: 'dark:text-xaki-300' }}
              {...register('password', { required: 'Parol kiritilishi shart' })}
              error={!!errors.password}
            />
            <Button type="submit" className="bg-bordo-600 text-white" loading={isLoading}>
              Kirish
            </Button>
          </form>

          <Typography variant="small" className="text-center text-siyoh-500 dark:text-xaki-300">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-semibold text-bordo-600">
              Ro'yxatdan o'ting
            </Link>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
