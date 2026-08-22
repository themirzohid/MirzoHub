import { Select, Option, Input } from '@material-tailwind/react';
import { DEVELOPER_CATEGORIES, LEVELS } from '../../constants/categories.js';

const inputColors = { className: 'dark:text-white', labelProps: { className: 'dark:text-xaki-300' } };

const DeveloperFilter = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-xaki-200 bg-white p-4 dark:border-siyoh-700 dark:bg-siyoh-800 sm:grid-cols-3">
      <Input
        label="Ism yoki texnologiya bo'yicha qidirish"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
        {...inputColors}
      />

      <Select label="Mutaxassislik" value={filters.category || ''} onChange={(v) => update('category', v)} {...inputColors}>
        <Option value="">Barchasi</Option>
        {DEVELOPER_CATEGORIES.map((c) => (
          <Option key={c.value} value={c.value}>
            {c.label}
          </Option>
        ))}
      </Select>

      <Select label="Daraja" value={filters.level || ''} onChange={(v) => update('level', v)} {...inputColors}>
        <Option value="">Barchasi</Option>
        {LEVELS.map((l) => (
          <Option key={l.value} value={l.value}>
            {l.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DeveloperFilter;
