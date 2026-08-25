import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Alert,
} from '@material-tailwind/react';
import api from '../../lib/axios.js';
import { getSocket } from '../../lib/socket.js';
import Loader from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const PLATFORM_LABELS = { zoom: 'Zoom', google_meet: 'Google Meet', other: 'Boshqa' };

const emptyForm = { title: '', platform: 'zoom', url: '', scheduledAt: '' };

const formatCountdown = (diffMs) => {
  if (diffMs <= 0) return 'Boshlandi';
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days} kun ${hours} soat qoldi`;
  if (hours > 0) return `${hours} soat ${minutes} daqiqa qoldi`;
  if (minutes > 0) return `${minutes} daqiqa ${seconds} soniya qoldi`;
  return `${seconds} soniya qoldi`;
};

const Countdown = ({ target }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = new Date(target).getTime() - now;
  return (
    <span className={diff <= 0 ? 'font-medium text-green-600' : 'text-siyoh-500 dark:text-xaki-300'}>
      {formatCountdown(diff)}
    </span>
  );
};

const MeetingList = ({ startup, myRole }) => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const canManage = myRole === 'owner' || myRole === 'admin';

  const loadMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/startups/${startup._id}/meetings`);
      setMeetings(data);
    } finally {
      setIsLoading(false);
    }
  }, [startup._id]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('joinStartupRoom', startup._id);
    socket.on('meetingCreated', loadMeetings);
    socket.on('meetingDeleted', loadMeetings);

    return () => {
      socket.off('meetingCreated', loadMeetings);
      socket.off('meetingDeleted', loadMeetings);
    };
  }, [startup._id, loadMeetings]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.url.trim() || !form.scheduledAt) return;
    setIsSubmitting(true);
    try {
      await api.post(`/startups/${startup._id}/meetings`, form);
      setIsFormOpen(false);
      setForm(emptyForm);
      await loadMeetings();
      setFeedback({ type: 'green', text: 'Uchrashuv rejalashtirildi' });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (meetingId) => {
    if (!confirm("Rostdan ham bu uchrashuvni bekor qilmoqchimisiz?")) return;
    setActioningId(meetingId);
    try {
      await api.delete(`/startups/${startup._id}/meetings/${meetingId}`);
      await loadMeetings();
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setActioningId(null);
    }
  };

  if (isLoading) return <Loader label="Uchrashuvlar yuklanmoqda..." />;

  const upcoming = [...meetings].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  return (
    <div className="rounded-xl border border-xaki-200 bg-white p-6 dark:border-siyoh-700 dark:bg-siyoh-800">
      {feedback && (
        <Alert color={feedback.type} className="mb-3">
          {feedback.text}
        </Alert>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-lg font-semibold dark:text-white">Uchrashuvlar ({meetings.length})</p>
        {canManage && (
          <Button size="sm" className="bg-bordo-600 text-white" onClick={() => setIsFormOpen(true)}>
            + Uchrashuv rejalashtirish
          </Button>
        )}
      </div>

      {upcoming.length === 0 ? (
        <EmptyState title="Hali uchrashuvlar yo'q" />
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map((meeting) => (
            <div
              key={meeting._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-xaki-200 p-3 dark:border-siyoh-700"
            >
              <div>
                <p className="text-sm font-medium dark:text-white">{meeting.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <Chip
                    size="sm"
                    variant="outlined"
                    value={PLATFORM_LABELS[meeting.platform]}
                    className="rounded-full"
                  />
                  <span className="text-siyoh-500 dark:text-xaki-300">
                    {new Date(meeting.scheduledAt).toLocaleString('uz-UZ')}
                  </span>
                  <Countdown target={meeting.scheduledAt} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a href={meeting.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-bordo-600 text-white">
                    Qo'shilish
                  </Button>
                </a>
                {canManage && (
                  <Button
                    size="sm"
                    variant="text"
                    color="red"
                    disabled={actioningId === meeting._id}
                    onClick={() => handleDelete(meeting._id)}
                  >
                    Bekor qilish
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} handler={() => setIsFormOpen(false)} className="dark:bg-siyoh-800">
        <DialogHeader className="dark:text-white">Uchrashuv rejalashtirish</DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <Input label="Sarlavha" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="Platforma" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })}>
            {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
          <Input label="Havola (URL)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Input
            type="datetime-local"
            label="Sana va vaqt"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" onClick={() => setIsFormOpen(false)}>
            Bekor qilish
          </Button>
          <Button className="bg-bordo-600 text-white" loading={isSubmitting} onClick={handleCreate}>
            Rejalashtirish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MeetingList;
