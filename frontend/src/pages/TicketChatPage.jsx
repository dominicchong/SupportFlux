import { useEffect, useState } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { useParams, useNavigate } from 'react-router-dom';
import TicketChatContainer from '../components/TicketChatContainer';

const TicketChatPage = () => {
  const { fetchTicketById } = useTicketStore();
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    setIsLoading(true);
    fetchTicketById(ticketId)
      .catch(() => navigate("/live-chat"))
      .finally(setIsLoading(false));
  }, [ticketId, fetchTicketById, navigate]);

  return (
    <div className="h-screen w-full">
      <div className="w-full pt-16 overflow-y-auto h-full">
        {!isLoading && 
          <TicketChatContainer />
        }
      </div>
  </div>
  )
};

export default TicketChatPage