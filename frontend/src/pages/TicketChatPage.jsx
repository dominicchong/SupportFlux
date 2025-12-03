import { useEffect, useState } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

const TicketChatPage = () => {
  const { selectedTicket, setSelectedTicket, tickets, fetchTicketById } = useTicketStore();
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }

    fetchTicketById(ticketId)
      .catch(() => navigate("/live-chat"))
      .finally(() => setLoading(false));
  }, [ticketId, fetchTicketById, navigate]);

  return (
    <div className="h-screen w-full bg-base-200">
      <div className="w-full pt-16 overflow-y-auto h-full">
        {/* {!selectedTicket ? <NoChatSelected /> : <ChatContainer />} */}
        <ChatContainer />
      </div>
  </div>
  )
};

export default TicketChatPage