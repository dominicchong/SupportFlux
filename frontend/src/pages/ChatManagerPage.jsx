import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore"; // You will create/adjust this store

const ChatManagerPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, pending, resolved

  const { getMessages, messages, subscribeToMessages, markResolved } = useChatStore();

  useEffect(() => {
    getMessages();
    subscribeToMessages();
  }, [getMessages, subscribeToMessages]);

  // Filter logic for search + tab
  const filteredChats = messages.filter((chat) => {
    const matchesSearch =
      chat.studentName.toLowerCase().includes(search.toLowerCase()) ||
      chat.issueTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeTab === "all" ? true : chat.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 pt-20 w-full mx-auto max-w-5xl space-y-4">
      <h2 className="text-xl font-semibold">Chat Issue Manager</h2>

      {/* Search Bar */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400 size-4" />
          <input
            type="text"
            placeholder="Search student or issue..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2 text-sm">
        {["all", "pending", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {filteredChats.length > 0 ? (
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Issue</th>
                <th className="text-left px-4 py-3">Unread</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Last Updated</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredChats.map((chat) => (
                <tr key={chat._id} className="hover:bg-gray-50">
                  <td>{chat.studentName}</td>
                  <td>{chat.issueTitle}</td>
                  <td>
                    {chat.unreadCount > 0 ? (
                      <span className="badge badge-error">{chat.unreadCount}</span>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        chat.status === "pending"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {chat.status}
                    </span>
                  </td>
                  <td>{new Date(chat.updatedAt).toLocaleString("en-MY")}</td>

                  <td className="text-center">
                    {chat.status === "pending" && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => markResolved(chat._id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-6">
            No chat issues found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagerPage;
