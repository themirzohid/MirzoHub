import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Alert,
} from '@material-tailwind/react';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import { categoryLabel } from '../constants/categories.js';
import { ROLE_LABELS, ROLE_COLORS, getStartupRole, canManageMember } from '../constants/roles.js';
import MatchingDevelopers from '../components/startup/MatchingDevelopers.jsx';
import TaskManager from '../components/startup/TaskManager.jsx';
import MeetingList from '../components/startup/MeetingList.jsx';
import Loader from '../components/common/Loader.jsx';

const StartupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinMessage, setJoinMessage] = useState(''); // IXTIYORIY - yozish majburiy emas
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const loadStartup = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/startups/${id}`);
      setStartup(data);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStartup();
  }, [loadStartup]);

  if (isLoading) return <Loader />;
  if (!startup) return null;

  const myRole = getStartupRole(startup, currentUser);

  const handleChangeRole = async (userId, newRole) => {
    setActioningId(userId);
    try {
      await api.patch(`/startups/${startup._id}/members/${userId}/role`, { role: newRole });
      await loadStartup();
      setFeedback({ type: 'green', text: 'Rol yangilandi' });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setActioningId(null);
    }
  };

  const handleRemoveMember = async (userId) => {
    const isSelf = userId === currentUser?._id;
    const confirmText = isSelf
      ? 'Rostdan ham bu startapdan chiqib ketmoqchimisiz?'
      : "Rostdan ham bu a'zoni jamoadan chiqarmoqchimisiz?";
    if (!confirm(confirmText)) return;

    setActioningId(userId);
    try {
      await api.delete(`/startups/${startup._id}/members/${userId}`);
      if (isSelf) {
        navigate('/');
        return;
      }
      await loadStartup();
      setFeedback({ type: 'green', text: "A'zo jamoadan chiqarildi" });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setActioningId(null);
    }
  };

  const handleJoinRequest = async () => {
    setIsSubmitting(true);
    try {
      // message maydoni bo'sh bo'lishi mumkin - bu majburiy emas
      await api.post('/requests/join', { startupId: startup._id, message: joinMessage });
      setFeedback({ type: 'green', text: "So'rovingiz yuborildi!" });
      setIsJoinOpen(false);
      setJoinMessage('');
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Rostdan ham bu startapni o'chirmoqchimisiz?")) return;
    await api.delete(`/startups/${startup._id}`);
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6">
      {feedback && <Alert color={feedback.type}>{feedback.text}</Alert>}

      <div className="flex flex-col gap-3 rounded-xl border border-xaki-200 bg-white p-6 dark:border-siyoh-700 dark:bg-siyoh-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Typography variant="h3" className="dark:text-white">{startup.title}</Typography>
            <div className="mt-2 flex items-center gap-2 text-sm text-siyoh-500 dark:text-xaki-300">
              <Avatar
                size="xs"
                src={startup.owner.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${startup.owner.fullName}`}
              />
              <Link to={`/developers/${startup.owner._id}`} className="hover:underline">
                {startup.owner.fullName}
              </Link>
              <span>·</span>
              <span>{startup.industry || 'Soha ko\'rsatilmagan'}</span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {(myRole === 'owner' || myRole === 'admin') && (
              <Link to={`/startups/${startup._id}/edit`}>
                <Button size="sm" variant="outlined">
                  Tahrirlash
                </Button>
              </Link>
            )}
            {myRole === 'owner' && (
              <Button size="sm" color="red" variant="outlined" onClick={handleDelete}>
                O'chirish
              </Button>
            )}
            {/* "Qo'shilish" tugmasi HAR DOIM ko'rinadi - o'zi haqida yozish shart emas */}
            {!myRole && isAuthenticated && (
              <Button className="bg-bordo-600 text-white" onClick={() => setIsJoinOpen(true)}>
                Jamoaga qo'shilish
              </Button>
            )}
          </div>
        </div>

        <Typography className="whitespace-pre-line text-siyoh-600 dark:text-xaki-100">{startup.description}</Typography>

        {startup.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {startup.tags.map((tag, i) => (
              <Chip key={i} size="sm" variant="ghost" value={tag} className="rounded-full" />
            ))}
          </div>
        )}
      </div>

      {startup.requiredRoles?.length > 0 && (
        <div className="rounded-xl border border-xaki-200 bg-white p-6 dark:border-siyoh-700 dark:bg-siyoh-800">
          <Typography variant="h6" className="mb-3 dark:text-white">
            Kerakli mutaxassislar
          </Typography>
          <div className="flex flex-wrap gap-2">
            {startup.requiredRoles.map((r, i) => (
              <Chip
                key={i}
                variant="outlined"
                value={`${categoryLabel(r.category)} · ${r.level} · ${r.slots} ta`}
                className="rounded-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* Faqat startap egasi/adminiga ko'rinadigan, IXTIYORIY moslik filtri */}
      {(myRole === 'owner' || myRole === 'admin') && (
        <MatchingDevelopers requiredRoles={startup.requiredRoles} />
      )}

      <div className="rounded-xl border border-xaki-200 bg-white p-6 dark:border-siyoh-700 dark:bg-siyoh-800">
        <Typography variant="h6" className="mb-3 dark:text-white">
          Jamoa a'zolari ({startup.teamMembers.length})
        </Typography>
        <div className="flex flex-col gap-2">
          {startup.teamMembers.map((m) => {
            const isSelf = m.user._id === currentUser?._id;
            const canManage = myRole ? canManageMember(myRole, m.role) : false;
            const isActioning = actioningId === m.user._id;

            return (
              <div
                key={m.user._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-xaki-200 p-2 dark:border-siyoh-700"
              >
                <Link
                  to={`/developers/${m.user._id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Avatar
                    size="xs"
                    src={m.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.user.fullName}`}
                  />
                  <span className="text-sm text-siyoh-700 dark:text-xaki-100">{m.user.fullName}</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Chip size="sm" color={ROLE_COLORS[m.role]} value={ROLE_LABELS[m.role]} className="rounded-full" />

                  {canManage && (
                    <>
                      <Button
                        size="sm"
                        variant="text"
                        disabled={isActioning}
                        onClick={() => handleChangeRole(m.user._id, m.role === 'admin' ? 'member' : 'admin')}
                      >
                        {m.role === 'admin' ? "A'zoga tushirish" : "Adminga ko'tarish"}
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        color="red"
                        disabled={isActioning}
                        onClick={() => handleRemoveMember(m.user._id)}
                      >
                        Chiqarish
                      </Button>
                    </>
                  )}

                  {isSelf && myRole !== 'owner' && (
                    <Button
                      size="sm"
                      variant="text"
                      color="red"
                      disabled={isActioning}
                      onClick={() => handleRemoveMember(m.user._id)}
                    >
                      Chiqib ketish
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {myRole && <TaskManager startup={startup} myRole={myRole} currentUser={currentUser} />}
      {myRole && <MeetingList startup={startup} myRole={myRole} />}

      <Dialog open={isJoinOpen} handler={() => setIsJoinOpen(false)} className="dark:bg-siyoh-800">
        <DialogHeader className="dark:text-white">Jamoaga qo'shilish so'rovi</DialogHeader>
        <DialogBody className="flex flex-col gap-2">
          <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
            O'zingiz haqingizda yozish shart emas — xohlasangiz qisqacha xabar qoldiring, xohlamasangiz
            shunchaki so'rov yuboraverishingiz mumkin.
          </Typography>
          <Textarea
            label="Xabar (ixtiyoriy)"
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" onClick={() => setIsJoinOpen(false)}>
            Bekor qilish
          </Button>
          <Button className="bg-bordo-600 text-white" loading={isSubmitting} onClick={handleJoinRequest}>
            So'rov yuborish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default StartupDetailPage;
