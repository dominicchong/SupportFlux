import { X, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTicketStore } from "../store/useTicketStore";
import TicketStatusBadge from "./utils/TicketStatusBadge";

const ChatHeader = () => {
  const { selectedTicket, setSelectedTicket } = useTicketStore();
  const navigate = useNavigate();

  const ticketCategory = selectedTicket?.category;
  const ticketStatus = selectedTicket?.status;
  const ticketLevel = selectedTicket?.level;

  const ticketLevelShort = (level) => {
    if (!level) {
      return "";
    }

    if (level == "Undergraduate"){
      return "UG";
    } else if (level == "Postgraduate") {
      return "PG";
    }
  }

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
            <div>
              <span className="font-medium pr-2">{ticketCategory}</span>
              <span className="inline-flex px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                <GraduationCap className="size-3.5" />
                <span className="pl-1">{ticketLevelShort(ticketLevel)}</span>
              </span>
            </div>

            <TicketStatusBadge status={ticketStatus} />
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