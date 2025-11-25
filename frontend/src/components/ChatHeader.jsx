import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useTicketStore } from "../store/useTicketStore";

const ChatHeader = () => {
  const { selectedTicket, setSelectedTicket } = useTicketStore();

  const ticketCategory = selectedTicket.category;
  const ticketStatus = selectedTicket.status;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User info */}
          <div>
            <h3 className="font-medium">
              {ticketCategory}
            </h3>
            <span
              className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-1
                          ${ticketStatus === "New" ? "bg-red-600 text-white" : ""}
                          ${ticketStatus === "In Progress" ? "bg-blue-600 text-white" : ""}
                          ${ticketStatus === "Resolved" ? "bg-yellow-600 text-white" : ""}
                        `}
            >
              {ticketStatus}
            </span>
            {/* <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p> */}
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedTicket(null)}
          className="p-1 rounded-full hover:bg-zinc-100 active:scale-95 transition-all duration-150 cursor-pointer">
          <X className="text-zinc-700" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;