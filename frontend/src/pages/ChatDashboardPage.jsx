import { BarChart, MessagesSquare, Clock, MessageSquarePlus } from "lucide-react";
import { useTicketStore } from "../store/useTicketStore";
import { useChatStore } from "../store/useChatStore";
import { StatCard, ChatsByCategory, CommonWordsPanel } from "../components/ChatDashboardComponents"
import { useEffect } from "react";

const ChatDashboardPage = () => {
  const { tickets, statusList, getTicketCountByStatus, getCategories, fetchAllTickets } = useTicketStore();
  const { allMessages, getAllMessages, getCommonWords } = useChatStore();
  const categories = getCategories();

  useEffect(() => {
    fetchAllTickets();
    getAllMessages();
  }, [])

  const commonWords = getCommonWords();

  return (
    <div className="p-6 pt-20 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Chat Dashboard</h2>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Chats" value={tickets.length} icon={MessagesSquare} />
        <StatCard title="New Chats" value={getTicketCountByStatus("New")} icon={MessageSquarePlus} />
        <StatCard title="In Progress Chats" value={getTicketCountByStatus("In Progress")} icon={Clock} />
        <StatCard title="Resolved Chats" value={getTicketCountByStatus("Resolved")} icon={BarChart} />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChatsByCategory categories={categories} tickets={tickets} />
        <CommonWordsPanel words={commonWords} />
      </div>
    </div>
  );
};

export default ChatDashboardPage;
