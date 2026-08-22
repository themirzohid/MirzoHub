import { Select, Option, Input } from '@material-tailwind/react';
import { DEVELOPER_CATEGORIES, LEVELS, STARTUP_STAGES } from '../../constants/categories.js';

const inputColors = { className: 'dark:text-white', labelProps: { className: 'dark:text-xaki-300' } };

// Barcha filtrlar ixtiyoriy — hech qaysi biri tanlanmasa, to'liq ro'yxat chiqadi
const StartupFilter = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-xaki-200 bg-white p-4 dark:border-siyoh-700 dark:bg-siyoh-800 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Qidirish"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
        {...inputColors}
      />

      <Select label="Kerakli mutaxassislik" value={filters.role || ''} onChange={(v) => update('role', v)} {...inputColors}>
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

      <Select label="Bosqich" value={filters.stage || ''} onChange={(v) => update('stage', v)} {...inputColors}>
        <Option value="">Barchasi</Option>
        {STARTUP_STAGES.map((s) => (
          <Option key={s.value} value={s.value}>
            {s.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default StartupFilter;
