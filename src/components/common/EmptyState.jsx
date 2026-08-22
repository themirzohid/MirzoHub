const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-xaki-300 py-16 text-center dark:border-siyoh-600">
    <p className="text-base font-medium text-siyoh-700 dark:text-xaki-50">{title}</p>
    {description && <p className="max-w-sm text-sm text-siyoh-400 dark:text-xaki-300">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
