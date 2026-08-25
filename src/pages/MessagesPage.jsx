import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@material-tailwind/react';
import api from '../lib/axios.js';
import { useChatStore } from '../store/chatStore.js';
import ConversationList from '../components/chat/ConversationList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import Loader from '../components/common/Loader.jsx';

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useChatStore();

  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      await fetchConversations();
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Suhbatlarni yuklab bo\'lmadi');
    } finally {
      setIsLoading(false);
    }
  }, [fetchConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!userId) {
      setPartner(null);
      return;
    }
    const existing = conversations.find((c) => c.user._id === userId);
    if (existing) {
      setPartner(existing.user);
      return;
    }
    api
      .get(`/users/${userId}`)
      .then(({ data }) => setPartner(data))
      .catch(() => setPartner(null));
  }, [userId, conversations]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <Typography variant="h4" className="dark:text-white">
        Xabarlar
      </Typography>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-xaki-200 bg-white dark:border-siyoh-700 dark:bg-siyoh-800">
        {/* Mobilda: userId tanlanmagan bo'lsa ro'yxat, tanlangan bo'lsa yashiriladi.
            sm va undan katta ekranlarda: ikkalasi doim yonma-yon ko'rinadi. */}
        <div
          className={`thin-scrollbar w-full shrink-0 overflow-y-auto border-r border-xaki-100 dark:border-siyoh-700 sm:block sm:w-72 ${
            userId ? 'hidden' : 'block'
          }`}
        >
          {isLoading ? (
            <Loader label="Suhbatlar yuklanmoqda..." />
          ) : loadError ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center text-sm text-siyoh-400 dark:text-xaki-400">
              <p>{loadError}</p>
              <Button size="sm" variant="text" onClick={loadConversations}>
                Qayta urinish
              </Button>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              activeUserId={userId}
              onSelect={(id) => navigate(`/messages/${id}`)}
            />
          )}
        </div>

        <div className={`flex-1 ${userId ? 'block' : 'hidden sm:block'}`}>
          <ChatWindow partner={partner} onBack={() => navigate('/messages')} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
