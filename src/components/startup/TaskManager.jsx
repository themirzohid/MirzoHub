import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
  Alert,
} from '@material-tailwind/react';
import api from '../../lib/axios.js';
import { getSocket } from '../../lib/socket.js';
import Loader from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';

const STATUS_LABELS = { todo: 'Bajarilmagan', in_progress: 'Jarayonda', done: 'Bajarildi' };
const STATUS_COLORS = { todo: 'blue-gray', in_progress: 'blue', done: 'green' };
const PRIORITY_LABELS = { low: 'Past', medium: "O'rta", urgent: 'Shoshilinch' };
const PRIORITY_COLORS = { low: 'blue-gray', medium: 'amber', urgent: 'red' };

const emptyForm = { title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' };

const TaskManager = ({ startup, myPermission, currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const canManage = myPermission === 'owner' || myPermission === 'admin';
  // owner backendda teamMembers ichida ham bor - takrorlanmasin
  const members = [
    { _id: startup.owner._id, fullName: startup.owner.fullName },
    ...startup.teamMembers
      .filter((m) => m.user._id !== startup.owner._id)
      .map((m) => ({ _id: m.user._id, fullName: m.user.fullName })),
  ];

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data } = await api.get('/tasks', { params: { startupId: startup._id } });
      setTasks(data);
    } catch (err) {
      setLoadError(
        err.response?.status === 404
          ? 'Vazifalar funksiyasi hali serverga ulanmagan'
          : err.response?.data?.message || "Vazifalarni yuklab bo'lmadi"
      );
    } finally {
      setIsLoading(false);
    }
  }, [startup._id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('joinStartupRoom', startup._id);
    socket.on('taskCreated', loadTasks);
    socket.on('taskUpdated', loadTasks);
    socket.on('taskDeleted', loadTasks);

    return () => {
      socket.off('taskCreated', loadTasks);
      socket.off('taskUpdated', loadTasks);
      socket.off('taskDeleted', loadTasks);
    };
  }, [startup._id, loadTasks]);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/tasks', {
        ...form,
        startupId: startup._id,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      setIsFormOpen(false);
      setForm(emptyForm);
      await loadTasks();
      setFeedback({ type: 'green', text: "Vazifa qo'shildi" });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setActioningId(taskId);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await loadTasks();
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Rostdan ham bu vazifani o'chirmoqchimisiz?")) return;
    setActioningId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setActioningId(null);
    }
  };

  if (isLoading) return <Loader label="Vazifalar yuklanmoqda..." />;

  return (
    <div className="rounded-xl border border-xaki-200 bg-white p-6 dark:border-siyoh-700 dark:bg-siyoh-800">
      {feedback && (
        <Alert color={feedback.type} className="mb-3">
          {feedback.text}
        </Alert>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-lg font-semibold dark:text-white">Vazifalar ({tasks.length})</p>
        {canManage && !loadError && (
          <Button size="sm" className="bg-bordo-600 text-white" onClick={() => setIsFormOpen(true)}>
            + Vazifa qo'shish
          </Button>
        )}
      </div>

      {loadError ? (
        <EmptyState title={loadError} description="Iltimos keyinroq qayta urinib ko'ring." />
      ) : tasks.length === 0 ? (
        <EmptyState title="Hali vazifalar yo'q" />
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => {
            const isAssignee = task.assignedTo?._id === currentUser?._id;
            const canEditStatus = canManage || isAssignee;
            const isActioning = actioningId === task._id;
            const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

            return (
              <div
                key={task._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-xaki-200 p-3 dark:border-siyoh-700"
              >
                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-medium dark:text-white">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-siyoh-500 dark:text-xaki-300">{task.description}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-siyoh-500 dark:text-xaki-300">
                    {task.assignedTo && <span>{task.assignedTo.fullName}</span>}
                    {task.dueDate && (
                      <span className={isOverdue ? 'font-medium text-red-600' : ''}>
                        {new Date(task.dueDate).toLocaleDateString('uz-UZ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    color={PRIORITY_COLORS[task.priority]}
                    value={PRIORITY_LABELS[task.priority]}
                    className="rounded-full"
                  />

                  {canEditStatus ? (
                    <Select
                      size="md"
                      containerProps={{ className: 'min-w-[150px]' }}
                      label="Holat"
                      value={task.status}
                      disabled={isActioning}
                      onChange={(status) => handleStatusChange(task._id, status)}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <Option key={value} value={value}>
                          {label}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Chip
                      size="sm"
                      color={STATUS_COLORS[task.status]}
                      value={STATUS_LABELS[task.status]}
                      className="rounded-full"
                    />
                  )}

                  {canManage && (
                    <Button
                      size="sm"
                      variant="text"
                      color="red"
                      disabled={isActioning}
                      onClick={() => handleDelete(task._id)}
                    >
                      O'chirish
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isFormOpen} handler={() => setIsFormOpen(false)} className="dark:bg-siyoh-800">
        <DialogHeader className="dark:text-white">Yangi vazifa</DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <Input label="Sarlavha" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea
            label="Tavsif (ixtiyoriy)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Select
            label="Kimga tayinlansin (ixtiyoriy)"
            value={form.assignedTo}
            onChange={(v) => setForm({ ...form, assignedTo: v })}
          >
            {members.map((m) => (
              <Option key={m._id} value={m._id}>
                {m.fullName}
              </Option>
            ))}
          </Select>
          <Select label="Muhimlik" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })}>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
          <Input
            type="date"
            label="Muddat (ixtiyoriy)"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" onClick={() => setIsFormOpen(false)}>
            Bekor qilish
          </Button>
          <Button className="bg-bordo-600 text-white" loading={isSubmitting} onClick={handleCreate}>
            Qo'shish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TaskManager;
