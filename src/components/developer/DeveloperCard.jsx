import { Link } from 'react-router-dom';
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react';
import CategoryBadge from '../common/CategoryBadge.jsx';

const DeveloperCard = ({ developer, compact = false }) => (
  <Link to={`/developers/${developer._id}`}>
    <Card className="h-full border border-xaki-200 bg-white shadow-none transition-shadow hover:shadow-lg dark:border-siyoh-700 dark:bg-siyoh-800">
      <CardBody className="flex flex-col items-center gap-2 text-center">
        <Avatar
          size={compact ? 'md' : 'lg'}
          src={developer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${developer.fullName}`}
          alt={developer.fullName}
          className="ring-2 ring-xaki-200 dark:ring-siyoh-600"
        />
        <Typography variant="h6" className="line-clamp-1 text-siyoh-800 dark:text-white">
          {developer.fullName}
        </Typography>
        <CategoryBadge category={developer.category} level={developer.level} />

        {!compact && developer.techStack?.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-siyoh-400 dark:text-xaki-300">
            {developer.techStack.join(' · ')}
          </p>
        )}
      </CardBody>
    </Card>
  </Link>
);

export default DeveloperCard;
