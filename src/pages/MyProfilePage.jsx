import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Typography,
  Card,
  CardBody,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  IconButton,
  Alert,
  Avatar,
} from '@material-tailwind/react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import { CATEGORIES, LEVELS } from '../constants/categories.js';

const inputColors = { className: 'dark:text-white', labelProps: { className: 'dark:text-xaki-300' } };

const MyProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      category: user?.category || '',
      level: user?.level || '',
      avatar: user?.avatar || '',
      techStack: user?.techStack || [],
      certificates: user?.certificates || [],
    },
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: 'certificates',
  });

  const techStack = watch('techStack');
  const category = watch('category');
  const isRegularUser = category === 'Regular User';

  useEffect(() => {
    // Sahifa ochilganda serverdagi eng so'nggi profil ma'lumotini olamiz
    (async () => {
      const { data } = await api.get('/auth/me');
      reset({
        fullName: data.fullName,
        bio: data.bio,
        category: data.category,
        level: data.level,
        avatar: data.avatar,
        techStack: data.techStack || [],
        certificates: data.certificates || [],
      });
    })();
  }, [reset]);

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;
    setValue('techStack', [...techStack, value]);
    setTechInput('');
  };

  const removeTech = (index) => {
    setValue('techStack', techStack.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const payload = { ...data };
      if (isRegularUser) payload.level = 'N/A';

      const { data: updated } = await api.put('/users/profile/me', payload);
      updateUser(updated);
      setFeedback({ type: 'green', text: 'Profil yangilandi!' });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar
          size="xl"
          src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
        />
        <div>
          <Typography variant="h4" className="dark:text-white">Mening profilim</Typography>
          <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
            Boshqalar sizni shu ma'lumotlar orqali topadi
          </Typography>
        </div>
      </div>

      {feedback && <Alert color={feedback.type}>{feedback.text}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
          <CardBody className="flex flex-col gap-4">
            <Input label="To'liq ism" {...inputColors} {...register('fullName')} />
            <Textarea label="O'zingiz haqingizda (ixtiyoriy)" rows={3} {...inputColors} {...register('bio')} />
            <Input label="Avatar rasm havolasi (ixtiyoriy)" {...inputColors} {...register('avatar')} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Kategoriya" value={category} onChange={(v) => setValue('category', v)} {...inputColors}>
                {CATEGORIES.map((c) => (
                  <Option key={c.value} value={c.value}>
                    {c.label}
                  </Option>
                ))}
              </Select>

              {!isRegularUser && (
                <Select label="Daraja" value={watch('level')} onChange={(v) => setValue('level', v)} {...inputColors}>
                  {LEVELS.map((l) => (
                    <Option key={l.value} value={l.value}>
                      {l.label}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </CardBody>
        </Card>

        {!isRegularUser && (
          <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
            <CardBody className="flex flex-col gap-3">
              <Typography variant="h6" className="dark:text-white">Texnologik stek</Typography>
              <div className="flex gap-2">
                <Input
                  label="Masalan: React, Node.js"
                  {...inputColors}
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <Button className="shrink-0 bg-bordo-600 text-white" onClick={addTech} type="button">
                  Qo'shish
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack?.map((tech, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full bg-xaki-100 px-3 py-1 text-xs text-siyoh-700 dark:bg-siyoh-700 dark:text-xaki-100"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(i)} className="text-siyoh-400 hover:text-red-500 dark:text-xaki-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {!isRegularUser && (
          <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="dark:text-white">Sertifikatlar</Typography>
                <Button
                  type="button"
                  size="sm"
                  variant="outlined"
                  className="flex items-center gap-1"
                  onClick={() => appendCert({ title: '', issuer: '', issueDate: '', credentialUrl: '' })}
                >
                  <PlusIcon className="h-4 w-4" /> Qo'shish
                </Button>
              </div>

              {certFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-2 rounded-lg border border-xaki-100 p-3 dark:border-siyoh-700 sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <Input label="Nomi" {...inputColors} {...register(`certificates.${index}.title`)} />
                  <Input label="Bergan tashkilot" {...inputColors} {...register(`certificates.${index}.issuer`)} />
                  <Input type="date" label="Sana" {...inputColors} {...register(`certificates.${index}.issueDate`)} />
                  <IconButton variant="text" color="red" onClick={() => removeCert(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                  <Input
                    label="Sertifikat havolasi"
                    className="sm:col-span-4 dark:text-white"
                    labelProps={{ className: 'dark:text-xaki-300' }}
                    {...register(`certificates.${index}.credentialUrl`)}
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        <Button type="submit" className="bg-bordo-600 text-white" loading={isSubmitting}>
          Saqlash
        </Button>
      </form>
    </div>
  );
};

export default MyProfilePage;
