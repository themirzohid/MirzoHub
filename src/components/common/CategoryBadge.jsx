import { Chip } from '@material-tailwind/react';
import { categoryLabel } from '../../constants/categories.js';

const CATEGORY_COLORS = {
  'UI/UX Designer': 'pink',
  'Backend Developer': 'green',
  'Cyber Security Specialist': 'red',
  'Frontend Developer': 'blue',
  'Fullstack Developer': 'purple',
  'Regular User': 'gray',
};

const CategoryBadge = ({ category, level }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Chip
      size="sm"
      variant="ghost"
      color={CATEGORY_COLORS[category] || 'gray'}
      value={categoryLabel(category)}
      className="rounded-full text-xs"
    />
    {level && level !== 'N/A' && (
      <Chip
        size="sm"
        variant="outlined"
        value={level}
        className="rounded-full border-xaki-400 text-xs text-xaki-700 dark:border-xaki-500 dark:text-xaki-200"
      />
    )}
  </div>
);

export default CategoryBadge;
