import { Spinner } from '@material-tailwind/react';
import { useTranslation } from '../../hooks/useTranslation.js';

const Loader = ({ label }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-siyoh-400 dark:text-xaki-300">
      <Spinner className="h-8 w-8 text-bordo-600" />
      <p className="text-sm">{label || t('common.loading')}</p>
    </div>
  );
};

export default Loader;
