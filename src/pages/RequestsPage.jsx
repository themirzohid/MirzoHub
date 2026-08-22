import { useEffect, useState, useCallback } from 'react';
import { Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import api from '../lib/axios.js';
import RequestCard from '../components/requests/RequestCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const TABS = [
  { value: '', label: 'Barchasi' },
  { value: 'pending', label: 'Kutilayotgan' },
  { value: 'accepted', label: 'Qabul qilingan' },
  { value: 'rejected', label: 'Rad etilgan' },
];

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = activeTab ? { status: activeTab } : {};
      const { data } = await api.get('/requests/me', { params });
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleRespond = async (requestId, status) => {
    await api.put(`/requests/${requestId}/respond`, { status });
    setRequests((prev) => prev.map((r) => (r._id === requestId ? { ...r, status } : r)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h4" className="dark:text-white">
          So'rov va takliflar
        </Typography>
        <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
          Sizga kelgan qo'shilish so'rovlari va startap takliflarini shu yerda boshqarasiz
        </Typography>
      </div>

      <Tabs value={activeTab}>
        <TabsHeader className="dark:bg-siyoh-800">
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} onClick={() => setActiveTab(tab.value)} className="dark:text-xaki-100">
              {tab.label}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>

      {isLoading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <EmptyState title="Bu bo'limda hech narsa yo'q" />
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <RequestCard key={req._id} request={req} onRespond={handleRespond} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
