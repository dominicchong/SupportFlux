import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const userFullName = selectedUser.fullName;
  const userRole = selectedUser.role

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={userFullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {userFullName}
              <span
                className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-1 ml-2
                          ${userRole === "admin" ? "bg-red-600 text-white" : ""}
                          ${userRole === "staff" ? "bg-blue-600 text-white" : ""}
                          ${userRole === "student" ? "bg-yellow-600 text-white" : ""}
                        `}
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}
          className="p-1 rounded-full hover:bg-zinc-100 active:scale-95 transition-all duration-150 cursor-pointer">
          <X className="text-zinc-700"/>
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;