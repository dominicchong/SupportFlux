import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageCircleMore } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [ showOnlineOnly, setShowOnlineOnly ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers()
  }, [getUsers]);

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
    <aside className="h-full w-20 lg:w-76 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <MessageCircleMore className="size-6" />
          <span className="font-medium hidden lg:block">Live Chat</span>
        </div>

        {/* ✅ Search Bar */}
        <div className="mt-3 hidden lg:block">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {visibleUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center justify-between gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            {/* Right section: role */}
            <div
              className={`
                hidden lg:block text-xs font-semibold px-2 py-0.5 rounded-full
                ${user.role === "admin" ? "bg-red-600 text-white" : ""}
                ${user.role === "staff" ? "bg-blue-600 text-white" : ""}
                ${user.role === "student" ? "bg-yellow-600 text-white" : ""}
              `}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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