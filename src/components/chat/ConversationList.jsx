import { Avatar, Badge } from '@material-tailwind/react';
import { useChatStore } from '../../store/chatStore.js';

const ConversationList = ({ conversations, activeUserId, onSelect }) => {
  const onlineUserIds = useChatStore((s) => s.onlineUserIds);

  if (conversations.length === 0) {
    return <p className="p-4 text-sm text-siyoh-400 dark:text-xaki-400">Hozircha suhbatlar yo'q.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-xaki-100 dark:divide-siyoh-700">
      {conversations.map((conv) => {
        const isOnline = onlineUserIds.includes(conv.user._id);
        return (
          <button
            key={conv.user._id}
            onClick={() => onSelect(conv.user._id)}
            className={`flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-xaki-50 dark:hover:bg-siyoh-700 ${
              activeUserId === conv.user._id ? 'bg-bordo-50 dark:bg-siyoh-700' : ''
            }`}
          >
            <div className="relative">
              <Avatar
                size="sm"
                src={conv.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${conv.user.fullName}`}
                alt={conv.user.fullName}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-siyoh-800" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-siyoh-800 dark:text-white">{conv.user.fullName}</p>
              <p className="truncate text-xs text-siyoh-400 dark:text-xaki-300">{conv.lastMessage?.text}</p>
            </div>

            {conv.unreadCount > 0 && (
              <Badge content={conv.unreadCount} className="static h-5 w-5 rounded-full bg-bordo-600 text-white text-[10px]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
