import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Avatar, Button, Chip, Typography } from '@material-tailwind/react';
import { categoryLabel } from '../../constants/categories.js';

const TYPE_LABELS = {
  join_request: "Jamoaga qo'shilish so'rovi",
  invitation: 'Taklifnoma',
};

const STATUS_COLORS = { pending: 'amber', accepted: 'green', rejected: 'red' };
const STATUS_LABELS = { pending: 'Kutilmoqda', accepted: 'Qabul qilindi', rejected: 'Rad etildi' };

const RequestCard = ({ request, onRespond }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespond = async (status) => {
    setIsSubmitting(true);
    try {
      await onRespond(request._id, status);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={request.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${request.sender?.fullName}`}
            alt={request.sender?.fullName}
          />
          <div>
            <Typography variant="small" className="font-semibold dark:text-white">
              {request.sender?.fullName}
            </Typography>
            <p className="text-xs text-siyoh-500 dark:text-xaki-300">
              {TYPE_LABELS[request.type]} · {request.startup?.title}
              {request.role && ` · ${categoryLabel(request.role)}`}
            </p>
            {request.message && <p className="mt-1 text-xs text-siyoh-600 dark:text-xaki-200">"{request.message}"</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {request.status === 'pending' ? (
            <>
              <Button
                size="sm"
                color="green"
                disabled={isSubmitting}
                onClick={() => handleRespond('accepted')}
              >
                Rozi bo'lish
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="red"
                disabled={isSubmitting}
                onClick={() => handleRespond('rejected')}
              >
                Yo'q
              </Button>
            </>
          ) : (
            <Chip color={STATUS_COLORS[request.status]} value={STATUS_LABELS[request.status]} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RequestCard;
