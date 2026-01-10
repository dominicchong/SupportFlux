import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useTicketStore } from "../store/useTicketStore";
import { GraduationCap } from "lucide-react";
import TicketStatusBadge from "./utils/TicketStatusBadge";

const TicketPreview = ({ ticket, onlineUsers }) => {
  const { authUser } = useAuthStore();
  const { latestMessages, formatLatestMessages } = useChatStore();
  const { unreadCount } = useTicketStore();

  const authUserId = authUser._id;
  const preview = formatLatestMessages(ticket._id, authUserId);

  const ticketStatus = ticket.status;
  const ticketLevel = ticket?.level;

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

  return (
    <div className="flex items-center gap-3 min-w-0 w-full justify-between">
      {/* Left section: avatar + user info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-row text-left min-w-0">
          <span className="font-medium truncate pr-2">{ticket.category}</span>
          <span className="inline-flex px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
            <GraduationCap className="size-3.5" />
            <span className="pl-1">{ticketLevelShort(ticketLevel)}</span>
          </span>
          <TicketStatusBadge status={ticketStatus} />
          <div
            className="text-xs text-gray-500 truncate pr-5"
          >
            {preview ? preview : ("--No messages yet--")}
          </div>
        </div>
      </div>

      {/* Right section: unread counter */}
      <div className="flex-row text-center min-w-0">
        {unreadCount[ticket._id] > 0 && (
          <div className="ml-auto">
            <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center inline-block">
              {unreadCount[ticket._id]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


export default TicketPreview;