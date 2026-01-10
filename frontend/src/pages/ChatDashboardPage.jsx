import { BarChart, MessagesSquare, Clock, MessageSquarePlus, Calendar } from "lucide-react";
import { useTicketStore } from "../store/useTicketStore";
import { useChatStore } from "../store/useChatStore";
import { StatCard, ChatsByCategory, CommonWordsPanel } from "../components/ChatDashboardComponents";
import { useEffect, useMemo, useState } from "react";
import { useCategoryStore } from "../store/useCategoryStore";

const ChatDashboardPage = () => {
  const { tickets, fetchAllTickets } = useTicketStore();
  const { allMessages, getCommonWords, getAllMessages } = useChatStore();
  const { categories, getCategories } = useCategoryStore();

  const [timeRange, setTimeRange] = useState(7);

  const filterOptions = [
    { label: "Today", days: 1 },
    { label: "Last 3 Days", days: 3 },
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ];

  useEffect(() => {
    fetchAllTickets();
    getCategories();
    getAllMessages();
  }, [fetchAllTickets, getCategories, getAllMessages]);

  // 3. Meaningful Insight Logic
  const dashboardData = useMemo(() => {
    if (!tickets || !categories || categories.length === 0) {
      return { sortedCategories: [], filteredTicketCount: 0, filteredWords: [] };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    if (timeRange === 1) startDate.setHours(0, 0, 0, 0); // Reset to start of today

    // Filter tickets based on the time range
    const rangeTickets = tickets.filter(t => new Date(t.createdAt) >= startDate);

    const messagesArray = Array.isArray(allMessages) ? allMessages : Object.values(allMessages).flat();
    const rangeMessages = messagesArray.filter(m => new Date(m.createdAt) >= startDate);

    // Calculate the words based on filtered messages
    const filteredWords = getCommonWords(rangeMessages);

    // Map categories to the FILTERED ticket set
    const sorted = categories
      .map(catObj => {
        // Handle object structure from useCategoryStore
        const catName = typeof catObj === 'string' ? catObj : catObj.category;
        const catId = catObj._id || catName;
        return {
          id: catId,
          name: catName,
          count: rangeTickets.filter(t => t.category === catName).length
        };
      })
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count); // Highest frequency at index [0]

    return {
      sortedCategories: sorted,
      filteredTicketCount: rangeTickets.length,
      filteredWords: filteredWords
    };
  }, [tickets, categories, allMessages, timeRange, getCommonWords]);

  const { sortedCategories, filteredTicketCount, filteredWords } = dashboardData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 pt-20 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Chat Dashboard</h2>
            <p className="text-gray-500 text-sm">Priority Analysis for Student Support</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 px-3 text-gray-400 border-r border-gray-100 mr-1">
              <Calendar className="size-4" />
              <span className="text-xs font-bold uppercase">Range</span>
            </div>
            {filterOptions.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setTimeRange(opt.days)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === opt.days
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRIORITIZATION STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title={`Top Issue (${timeRange === 1 ? 'Today' : 'Last ' + timeRange + ' Days'})`}
            value={sortedCategories[0]?.count > 0 ? sortedCategories[0].name : "None"}
            icon={MessagesSquare}
            color="text-primary"
          />

          <StatCard
            title="Total New Chats"
            value={filteredTicketCount}
            icon={BarChart}
          />

          <StatCard
            title="Trending Keyword"
            value={filteredWords?.length > 0 ? filteredWords[0].word : "None Found"}
            icon={MessageSquarePlus}
          />
        </div>

        {/* GRAPHICAL ANALYSES & TRENDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800">Chat Frequency by Category</h3>
              <p className="text-sm text-gray-400">Prioritizing response allocation based on volume</p>
            </div>

            {/* Component visualization */}
            <ChatsByCategory categories={sortedCategories} tickets={tickets} />
          </div>

          <div className="space-y-6">
            {/* Semantic analysis component */}
            <CommonWordsPanel words={filteredWords} />

            {/* DYNAMIC RECOMMENDATION BOX: The "Meaningful Insight" part */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wider">Recommendation Insights</h4>
              </div>

              {sortedCategories.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <span className="font-bold">"{sortedCategories[0].name}"</span> is currently the highest frequency chat category.
                  </p>
                  <div className="p-3 bg-white/50 rounded-lg border border-blue-100 text-xs text-blue-700">
                    <strong>Action:</strong> Consider broadcasting a notice or updating the Knowledge Base for this category.
                  </div>
                </div>
              ) : (
                <p className="text-blue-800 text-sm">
                  No major chat patterns detected for this timeframe.
                </p>
              )}
            </div>
          </div>
        </div>
      </div >
    </div>
  );
};

export default ChatDashboardPage;