import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Avatar,
  Button,
  Chip,
  Card,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Alert,
} from '@material-tailwind/react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import Loader from '../components/common/Loader.jsx';

const DeveloperProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [developer, setDeveloper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [myStartups, setMyStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDeveloper = useCallback(async () => {
    setIsLoading(true);
    const { data } = await api.get(`/users/${id}`);
    setDeveloper(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadDeveloper();
  }, [loadDeveloper]);

  const openInviteDialog = async () => {
    setIsInviteOpen(true);
    const { data } = await api.get('/startups', { params: { owner: currentUser._id, limit: 50 } });
    setMyStartups(data.startups);
  };

  const handleInvite = async () => {
    if (!selectedStartupId) return;
    setIsSubmitting(true);
    try {
      await api.post('/requests/invite', {
        startupId: selectedStartupId,
        developerId: developer._id,
        role: developer.category,
      });
      setFeedback({ type: 'green', text: 'Taklifnoma yuborildi!' });
      setIsInviteOpen(false);
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!developer) return null;

  const isOwnProfile = currentUser?._id === developer._id;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {feedback && <Alert color={feedback.type}>{feedback.text}</Alert>}

      <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
        <CardBody className="flex flex-col items-center gap-3 text-center">
          <Avatar
            size="xxl"
            src={developer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${developer.fullName}`}
            alt={developer.fullName}
          />
          <Typography variant="h4" className="dark:text-white">{developer.fullName}</Typography>
          <CategoryBadge category={developer.category} level={developer.level} />
          {developer.bio && <Typography className="max-w-md text-siyoh-600 dark:text-xaki-200">{developer.bio}</Typography>}

          {!isOwnProfile && isAuthenticated && (
            <div className="mt-2 flex gap-2">
              <Button
                className="flex items-center gap-2 bg-bordo-600 text-white"
                onClick={() => navigate(`/messages/${developer._id}`)}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" /> Chatga o'tish
              </Button>
              {developer.category !== 'Regular User' && (
                <Button variant="outlined" className="flex items-center gap-2" onClick={openInviteDialog}>
                  <PaperAirplaneIcon className="h-4 w-4" /> Taklif yuborish
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {developer.techStack?.length > 0 && (
        <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
          <CardBody>
            <Typography variant="h6" className="mb-3 dark:text-white">
              Texnologik stek
            </Typography>
            <div className="flex flex-wrap gap-2">
              {developer.techStack.map((tech, i) => (
                <Chip key={i} value={tech} variant="ghost" className="rounded-full" />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {developer.certificates?.length > 0 && (
        <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
          <CardBody>
            <Typography variant="h6" className="mb-3 dark:text-white">
              Sertifikatlar
            </Typography>
            <div className="flex flex-col gap-3">
              {developer.certificates.map((cert, i) => (
                <div key={i} className="rounded-lg border border-xaki-100 p-3 dark:border-siyoh-700">
                  <p className="text-sm font-semibold dark:text-white">{cert.title}</p>
                  <p className="text-xs text-siyoh-500 dark:text-xaki-300">
                    {cert.issuer}
                    {cert.issueDate && ` · ${new Date(cert.issueDate).getFullYear()}`}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-bordo-600 hover:underline"
                    >
                      Sertifikatni ko'rish →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Dialog open={isInviteOpen} handler={() => setIsInviteOpen(false)} className="dark:bg-siyoh-800">
        <DialogHeader className="dark:text-white">{developer.fullName}ga taklif yuborish</DialogHeader>
        <DialogBody>
          {myStartups.length === 0 ? (
            <Typography className="text-sm text-siyoh-500 dark:text-xaki-300">
              Sizda hali startap yo'q.{' '}
              <a href="/startups/new" className="text-bordo-600 hover:underline">
                Avval startap yarating
              </a>
              .
            </Typography>
          ) : (
            <Select label="Qaysi startapga taklif qilasiz?" onChange={(v) => setSelectedStartupId(v)}>
              {myStartups.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.title}
                </Option>
              ))}
            </Select>
          )}
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" onClick={() => setIsInviteOpen(false)}>
            Bekor qilish
          </Button>
          <Button
            className="bg-bordo-600 text-white"
            disabled={!selectedStartupId}
            loading={isSubmitting}
            onClick={handleInvite}
          >
            Taklif yuborish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DeveloperProfilePage;
