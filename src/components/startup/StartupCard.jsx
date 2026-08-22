import { Link } from 'react-router-dom';
import { Card, CardBody, Chip, Typography } from '@material-tailwind/react';
import { categoryLabel } from '../../constants/categories.js';

const STAGE_LABELS = { Idea: "G'oya", MVP: 'MVP', Growth: "O'sish", Launched: 'Ishga tushgan' };

const StartupCard = ({ startup }) => (
  <Link to={`/startups/${startup._id}`}>
    <Card className="h-full border border-xaki-200 bg-white shadow-none transition-shadow hover:shadow-lg dark:border-siyoh-700 dark:bg-siyoh-800">
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Typography variant="h6" className="line-clamp-1 text-siyoh-800 dark:text-white">
            {startup.title}
          </Typography>
          <Chip
            size="sm"
            variant="ghost"
            value={STAGE_LABELS[startup.stage]}
            className="shrink-0 bg-xaki-100 text-xaki-700 dark:bg-siyoh-700 dark:text-xaki-200"
          />
        </div>

        <Typography variant="small" className="line-clamp-2 text-siyoh-500 dark:text-xaki-300">
          {startup.description}
        </Typography>

        {startup.requiredRoles?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {startup.requiredRoles.slice(0, 3).map((r, i) => (
              <Chip
                key={i}
                size="sm"
                variant="outlined"
                value={`${categoryLabel(r.category)} · ${r.level}`}
                className="rounded-full border-bordo-200 text-[11px] text-bordo-600 dark:border-bordo-700 dark:text-bordo-300"
              />
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between text-xs text-siyoh-400 dark:text-xaki-400">
          <span>{startup.owner?.fullName}</span>
          <span>{startup.teamMembers?.length || 0} nafar jamoada</span>
        </div>
      </CardBody>
    </Card>
  </Link>
);

export default StartupCard;
