import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageCircleMore } from "lucide-react";
import MessagePreview from "./MessagePreview";

const Sidebar = () => {
  const { authUser } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, clearUnread, 
    getUnreadCounts, getLatestMessages } = useChatStore();

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
            <MessagePreview user={user} onlineUsers={onlineUsers}/>
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