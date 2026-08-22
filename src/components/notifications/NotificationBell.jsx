import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Menu, MenuHandler, MenuList, MenuItem, IconButton } from '@material-tailwind/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotificationStore } from '../../store/notificationStore.js';

const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <div className="relative cursor-pointer">
          <IconButton variant="text" className="text-xaki-100 hover:bg-white/5">
            <BellIcon className="h-6 w-6" />
          </IconButton>
          {unreadCount > 0 && (
            <Badge
              content={unreadCount}
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-[11px]"
            />
          )}
        </div>
      </MenuHandler>
      <MenuList className="max-h-96 w-80 overflow-y-auto thin-scrollbar dark:border-siyoh-700 dark:bg-siyoh-800">
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-sm font-semibold dark:text-white">Bildirishnomalar</p>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-bordo-600 hover:underline"
            >
              Hammasini o'qildi deb belgilash
            </button>
          )}
        </div>

        {notifications.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-siyoh-500 dark:text-xaki-300">Bildirishnoma yo'q</p>
        )}

        {notifications.map((n) => (
          <MenuItem
            key={n._id}
            className={`flex flex-col items-start gap-0.5 dark:text-xaki-50 dark:hover:bg-siyoh-700 ${!n.isRead ? 'bg-bordo-50 dark:bg-siyoh-700/60' : ''}`}
          >
            <p className="text-sm">{n.text}</p>
            <span className="text-xs text-siyoh-400 dark:text-xaki-400">
              {new Date(n.createdAt).toLocaleString('uz-UZ')}
            </span>
          </MenuItem>
        ))}

        <Link to="/requests" className="block px-2 py-2 text-center text-xs text-bordo-600 hover:underline">
          Barcha so'rov/takliflarni ko'rish →
        </Link>
      </MenuList>
    </Menu>
  );
};

export default NotificationBell;
