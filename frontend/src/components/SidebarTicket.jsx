import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageCircleMore, Plus, Trash } from "lucide-react";
import TicketPreview from "./TicketPreview";
import TicketModal from "./TicketModal"
import { useTicketStore } from "../store/useTicketStore";
import toast from "react-hot-toast";

const SidebarTicket = () => {
  const { isStudent, onlineUsers, isUserAuthorized } = useAuthStore();
  const { isTicketsLoading, clearUnread, getUnreadCounts, getLatestMessages, deleteAllMessages } = useChatStore();
  const { tickets, fetchAllTickets, myTickets, fetchMyTickets, selectedTicket, setSelectedTicket, filter, setFilter, isLoadingTickets,
    statusList, filteredTickets, createTicket, getCategories } = useTicketStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ category: "" });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMyTickets();
    getUnreadCounts();
    getLatestMessages();
  }, [fetchMyTickets, getUnreadCounts, getLatestMessages]);

  const ticketCategories = ["All", ...getCategories()];
  const isAuthorized = isUserAuthorized();
  // console.log("My tickets:", myTickets);

  const openCreateModal = () => {
    setFormState({ category: "" });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.category) {
      toast.error("Category is required");
      return;
    }

    try {
      await createTicket(formState);
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalOpen(false);
      fetchAllTickets();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete all messages? \nThis is a permanent action.")) return;
    setIsDeleting(true);

    try {
      await deleteAllMessages();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      fetchAllTickets();
    }
  };

  if (isTicketsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 justify-start">
            <MessageCircleMore className="size-6" />
            <span className="font-medium">Live Chat</span>
          </div>

          <button
            onClick={openCreateModal}
            className="btn flex gap-1 items-center justify-end btn-custom-primary"
            title="Create new ticket"
          >
            {/* <Plus className="size-4" /> */}
            <span>New</span>
          </button>
        </div>

        {isAuthorized && (
          <button
            onClick={(e) => handleDelete()}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-red-400 cursor-pointer"
            title="Delete all messages"
          >
            <Trash className="size-4" />
            Delete All
          </button>
        )}

        {/* Search Bar */}
        <div className="flex mt-3 gap-2">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formState={formState}
          handleFormField={handleFormField}
          handleSubmit={handleSubmit}
          isNewCategory={isNewCategory}
          setIsNewCategory={setIsNewCategory}
          ticketCategories={ticketCategories}
        />
      </div>

      <div className="overflow-y-auto w-full py-3">
        {myTickets.map((ticket) => (
          <button
            key={ticket._id}
            onClick={() => {
              setSelectedTicket(ticket);
              // clearUnread(ticket._id); // Clear unread count when chat is opened
            }}
            className={`
              w-full p-3 flex items-center justify-between gap-3
              hover:bg-base-300 transition-colors
              ${selectedTicket?._id === ticket._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <TicketPreview ticket={ticket} onlineUsers={onlineUsers} />
          </button>
        ))}

        {myTickets.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No tickets found</div>
        )}
      </div>
    </aside>
  );
};
export default SidebarTicket;