import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageCircleMore, Plus, Trash, X } from "lucide-react";
import TicketPreview from "./TicketPreview";
import TicketModal from "./TicketModal"
import { useTicketStore } from "../store/useTicketStore";
import toast from "react-hot-toast";
import { SearchInput } from "./SearchInput";

const SidebarChat = () => {
  const { onlineUsers, isUserAuthorized } = useAuthStore();
  const { isTicketsLoading, getLatestMessages, deleteAllMessages } = useChatStore();
  const { fetchAllTickets, myTickets, fetchMyTickets, selectedTicket, setSelectedTicket, 
    createTicket, levelList, getUnreadCounts } = useTicketStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllTickets();
    fetchMyTickets();
    getUnreadCounts();
    getLatestMessages();
  }, [fetchMyTickets, getUnreadCounts, getLatestMessages]);

  const defaultNewTicketForm = {
    category: "",
    level: "",
  };

  const [formState, setFormState] = useState(defaultNewTicketForm);
  const isAuthorized = isUserAuthorized();

  const openCreateModal = () => {
    setFormState(defaultNewTicketForm);
    setIsModalOpen(true);
  };

  const closeTicketModal = () => {
    setFormState(defaultNewTicketForm);  // Reset form fields
    setIsModalOpen(false);
  };

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.category) {
      toast.error("Category is required!");
      return;
    } else if (!formState.level) {
      toast.error("Level of study is required!");
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

  // const handleDelete = async () => {
  //   if (!window.confirm("Delete all messages? \nThis is a permanent action.")) return;
  //   setIsDeleting(true);

  //   try {
  //     await deleteAllMessages();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsDeleting(false);
  //     fetchAllTickets();
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredTickets = myTickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    
    return (
      ticket.category?.toLowerCase().includes(query) || 
      ticket.level?.toLowerCase().includes(query) ||
      ticket.staffId?.fullName?.toLowerCase().includes(query)
    );
  });

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
            title="Create new chat"
          >
            <span>New Chat</span>
          </button>
        </div>

        {/* {isAuthorized && (
          <button
            onClick={(e) => handleDelete()}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-red-400 cursor-pointer"
            title="Delete all messages"
          >
            <Trash className="size-4" />
            Delete All
          </button>
        )} */}

        {/* Search Bar */}
        <div className="flex mt-3 gap-2 relative group">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search chats..."
          />
        </div>

        <TicketModal
          isOpen={isModalOpen}
          onClose={closeTicketModal}
          formState={formState}
          handleFormField={handleFormField}
          handleSubmit={handleSubmit}
          levelList={levelList}
        />
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredTickets.map((ticket) => (
          <button
            key={ticket._id}
            onClick={() => { setSelectedTicket(ticket); }}
            className={`
              w-full p-3 flex items-center justify-between gap-3
              hover:bg-base-300 transition-colors
              ${selectedTicket?._id === ticket._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <TicketPreview ticket={ticket} onlineUsers={onlineUsers} />
          </button>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No chats found</div>
        )}
      </div>
    </aside>
  );
};
export default SidebarChat;