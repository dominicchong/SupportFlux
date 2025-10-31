import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageCircleMore } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadCount, clearUnread, getUnreadCounts, latestMessages, getLatestMessages } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [ showOnlineOnly, setShowOnlineOnly ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authUser) {
      getUsers();
      getUnreadCounts();
      getLatestMessages();
    }
  }, [getUsers, getUnreadCounts, getLatestMessages]);

  const isStudent = useAuthStore((state) => state.authUser?.role === "student");

 // Apply online-only filter
  const onlineFiltered = showOnlineOnly
    ? users.filter(user => onlineUsers.includes(user._id))
    : users;

  // Role restriction for student
  const roleFiltered = isStudent
    ? onlineFiltered.filter(user => user.role === "admin" || user.role === "staff")
    : onlineFiltered;

  // Search filter
  const visibleUsers = roleFiltered.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <MessageCircleMore className="size-6" />
          <span className="font-medium">Live Chat</span>
        </div>

        {/* Search Bar */}
        <div className="flex mt-3 gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Online filter toggle */}
        <div className="flex mt-3 items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Online</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1})</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {visibleUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              clearUnread(user._id); // Clear unread count when chat is opened
            }}
            className={`
              w-full p-3 flex items-center justify-between gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
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

                  {/* Need to figure out how to solve this part of code */}
                  <div className="text-xs text-gray-500 truncate
                      max-w-xs sm:max-w-[120px] md:max-w-[150px]"
                  >
                    {/* {latestMessages?.[user._id].text || "--No messages yet--"} */}

                    {latestMessages?.[user._id] ? (
                      <>
                        {latestMessages?.[user._id].from === user._id
                          ? `You: ${latestMessages[user._id].text}`
                          : latestMessages?.[user._id].text}
                      </>
                    ) : (
                      "--No messages yet--"
                    )}
                  </div>
                </div>
              </div>

              {/* Right section: unread counter */}
              <div className="flex-row text-center min-w-0">
                <div
                  className={`
                    text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-2
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
          </button>
        ))}

        {visibleUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;