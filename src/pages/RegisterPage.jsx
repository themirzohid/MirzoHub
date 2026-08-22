import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Select, Option, Button, Typography, Alert } from '@material-tailwind/react';
import { useAuthStore } from '../store/authStore.js';
import { CATEGORIES, LEVELS } from '../constants/categories.js';

const inputColors = { className: 'dark:text-white', labelProps: { className: 'dark:text-xaki-300' } };

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { category: '', level: '' } });

  const selectedCategory = watch('category');
  const isRegularUser = selectedCategory === 'Regular User';

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (isRegularUser) delete payload.level; // "Oddiy foydalanuvchi" uchun daraja shart emas

    const result = await registerUser(payload);
    if (result.success) navigate('/');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10">
      <Card className="w-full border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" className="dark:text-white">
            Ro'yxatdan o'tish
          </Typography>
          <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
            Dasturchimisiz yoki shunchaki startap g'oyangiz bormi — ikkalasi uchun ham joy bor.
          </Typography>

          {error && <Alert color="red">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="To'liq ism"
              {...inputColors}
              {...register('fullName', { required: 'Ism kiritilishi shart' })}
              error={!!errors.fullName}
            />
            <Input
              label="Email"
              type="email"
              {...inputColors}
              {...register('email', { required: 'Email kiritilishi shart' })}
              error={!!errors.email}
            />
            <Input
              label="Parol"
              type="password"
              {...inputColors}
              {...register('password', {
                required: 'Parol kiritilishi shart',
                minLength: { value: 6, message: 'Kamida 6 ta belgi' },
              })}
              error={!!errors.password}
            />

            <Select label="Kimsiz?" onChange={(v) => setValue('category', v)} error={!!errors.category} {...inputColors}>
              {CATEGORIES.map((c) => (
                <Option key={c.value} value={c.value}>
                  {c.label}
                </Option>
              ))}
            </Select>
            <input type="hidden" {...register('category', { required: 'Kategoriya tanlanishi shart' })} />

            {/* Faqat haqiqiy mutaxassislar uchun daraja tanlanadi */}
            {selectedCategory && !isRegularUser && (
              <Select label="Darajangiz" onChange={(v) => setValue('level', v)} error={!!errors.level} {...inputColors}>
                {LEVELS.map((l) => (
                  <Option key={l.value} value={l.value}>
                    {l.label}
                  </Option>
                ))}
              </Select>
            )}

            <Button type="submit" className="bg-bordo-600 text-white" loading={isLoading}>
              Ro'yxatdan o'tish
            </Button>
          </form>

          <Typography variant="small" className="text-center text-siyoh-500 dark:text-xaki-300">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="font-semibold text-bordo-600 dark:text-bordo-400">
              Kiring
            </Link>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
