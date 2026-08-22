import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
    <Typography variant="h1" className="text-6xl text-bordo-600 dark:text-bordo-400">
      404
    </Typography>
    <Typography variant="h5" className="dark:text-white">
      Sahifa topilmadi
    </Typography>
    <Typography className="text-siyoh-500 dark:text-xaki-300">
      Siz izlagan sahifa mavjud emas yoki ko'chirilgan.
    </Typography>
    <Link to="/">
      <Button className="mt-2 bg-bordo-600 text-white">Bosh sahifaga qaytish</Button>
    </Link>
  </div>
);

export default NotFoundPage;
