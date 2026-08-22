import { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton, Input } from '@material-tailwind/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import MessageBubble from './MessageBubble.jsx';
import Loader from '../common/Loader.jsx';

const ChatWindow = ({ partner, onBack }) => {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { messages, fetchConversation, sendMessage, setActiveConversation } = useChatStore();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!partner?._id) return;
    setActiveConversation(partner._id);
    setIsLoading(true);
    fetchConversation(partner._id).finally(() => setIsLoading(false));
  }, [partner?._id, fetchConversation, setActiveConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await sendMessage(partner._id, trimmed);
  };

  if (!partner) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-siyoh-400 dark:text-xaki-400">
        Suhbatni boshlash uchun chapdan foydalanuvchini tanlang
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-xaki-100 px-4 py-3 dark:border-siyoh-700">
        {/* Orqaga tugmasi - faqat mobilda, sm dan katta ekranlarda kerak emas */}
        {onBack && (
          <IconButton variant="text" size="sm" className="text-siyoh-600 dark:text-xaki-100 sm:hidden" onClick={onBack}>
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
        )}
        <Avatar
          size="sm"
          src={partner.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${partner.fullName}`}
          alt={partner.fullName}
        />
        <p className="text-sm font-semibold text-siyoh-800 dark:text-white">{partner.fullName}</p>
      </div>

      <div className="thin-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <Loader label="Suhbat yuklanmoqda..." />
        ) : (
          messages.map((m) => (
            <MessageBubble key={m._id} message={m} isOwn={(m.sender?._id || m.sender) === currentUserId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-xaki-100 p-3 dark:border-siyoh-700">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Xabar yozing..."
          containerProps={{ className: 'flex-1' }}
          className="dark:text-white"
        />
        <IconButton type="submit" className="bg-bordo-600 text-white">
          <PaperAirplaneIcon className="h-4 w-4" />
        </IconButton>
      </form>
    </div>
  );
};

export default ChatWindow;
