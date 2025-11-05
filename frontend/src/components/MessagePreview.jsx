import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const MessagePreview = ({ user, onlineUsers }) => {
  const { authUser } = useAuthStore();
  const { unreadCount, latestMessages } = useChatStore();

  const authUserId = authUser._id;
  const msg = latestMessages?.[user._id];
  const isYou = msg?.senderId === authUserId;
  const preview = msg?.text || (msg?.image ? "🖼️ Image" : "");

  return (
    <div className="flex items-center gap-3 min-w-0 w-full justify-between">
      {/* Left section: avatar + user info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="size-12 object-cover rounded-full"
          />
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
          )}
        </div>

        <div className="flex-row text-left min-w-0">
          <span className="font-medium truncate">{user.fullName}</span>

          <div 
            className="text-xs text-gray-500 truncate max-w-xs sm:max-w-[120px] md:max-w-[150px]"
          >
            {msg ? (isYou ? `You: ${preview}` : preview) : ("--No messages yet--")}
          </div>
        </div>
      </div>

      {/* Right section: unread counter */}
      <div className="flex-row text-center min-w-0">
        <div
          className={`
                    text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-1
                    ${user.role === "admin" ? "bg-red-600 text-white" : ""}
                    ${user.role === "staff" ? "bg-blue-600 text-white" : ""}
                    ${user.role === "student" ? "bg-yellow-600 text-white" : ""}
                  `}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>

        {unreadCount[user._id] > 0 && (
          <div className="ml-auto">
            <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] text-center inline-block">
              {unreadCount[user._id]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


export default MessagePreview;