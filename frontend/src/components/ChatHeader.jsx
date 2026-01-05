import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTicketStore } from "../store/useTicketStore";
import TicketStatusBadge from "./utils/TicketStatusBadge";

const ChatHeader = () => {
  const { selectedTicket, setSelectedTicket } = useTicketStore();
  const navigate = useNavigate();

  const ticketCategory = selectedTicket?.category;
  const ticketStatus = selectedTicket?.status;

  const handleClose = () => {
    setSelectedTicket(null);
    navigate("/live-chat");
  }

  return (
    <div className="p-2.5 pl-5 border-b border-base-300 bg-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User info */}
          <div>
            <h3 className="font-medium">
              {ticketCategory}
            </h3>
            <TicketStatusBadge status={ticketStatus}/>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => handleClose()}
          className="p-1 rounded-full hover:bg-zinc-100 active:scale-95 transition-all duration-150 cursor-pointer">
          <X className="text-zinc-700" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;