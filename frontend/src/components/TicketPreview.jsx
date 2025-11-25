import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useTicketStore } from "../store/useTicketStore";

const TicketPreview = ({ ticket, onlineUsers }) => {
  const { authUser } = useAuthStore();
  const { unreadCount, latestMessages } = useChatStore();
  const { selectedTicket } = useTicketStore();

  const authUserId = authUser._id;
  const msg = latestMessages?.[ticket._id];
  const isYou = msg?.senderId === authUserId;
  const preview = msg?.text || (msg?.image ? "🖼️ Image" : "");

  const ticketStatus = ticket.status;

  return (
    <div className="flex items-center gap-3 min-w-0 w-full justify-between">
      {/* Left section: avatar + user info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* <div className="relative">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="size-12 object-cover rounded-full"
          />
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
          )}
        </div> */}

        <div className="flex-row text-left min-w-0">
          <span className="font-medium truncate">{ticket.category}</span>
          <div
            className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-1
                          ${ticketStatus === "New" ? "bg-red-600 text-white" : ""}
                          ${ticketStatus === "In Progress" ? "bg-blue-600 text-white" : ""}
                          ${ticketStatus === "Resolved" ? "bg-yellow-600 text-white" : ""}
                        `}
          >
            {ticketStatus}
          </div>

          <div
            className="text-xs text-gray-500 truncate max-w-xs sm:max-w-[120px] md:max-w-[150px]"
          >
            {msg ? (isYou ? `You: ${preview}` : preview) : ("--No messages yet--")}
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