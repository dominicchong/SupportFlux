import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from "../store/useTicketStore";
import { Search, Plus, Trash, CheckCheck, Clock, Loader } from "lucide-react";
import TicketModal from "../components/TicketModal"

const TicketManagerPage = () => {
  const { tickets, fetchAllTickets, setSelectedTicket, updateTicketStatus, filter, setFilter, isLoadingTickets,
    statusList, filteredTickets, createTicket, getCategories, chatByTicket, deleteAllTickets } = useTicketStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ category: "" });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  // const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const visibleTickets = filteredTickets();
  const ticketCategories = ["All", ...getCategories()];
  const navigate = useNavigate();

  const openCreateModal = () => {
    setFormState({ category: "" });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const handleChat = (ticket) => {
    setSelectedTicket(ticket);
    navigate(`/ticket/${ticket._id}/chat`)
  }

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.category) {
      alert("All fields are required");
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
    if (!window.confirm("Delete all tickets? \nThis is a permanent action.")) return;
    setIsDeleting(true);

    try {
      await deleteAllTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      fetchAllTickets();
    }
  };

  return (
    <div className="p-6 pt-20 w-full mx-auto max-w-5xl space-y-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold">Ticket Manager</h2>

        <div className="flex items-end justify-right space-x-3">
          <button
            onClick={(e) => navigate('/ticket-chats')}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-emerald-400 cursor-pointer"
            title="Navigate to Live Chat"
          >
            Live Chat
          </button>

          <button
            onClick={(e) => handleDelete()}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-red-400 cursor-pointer"
            title="Delete all tickets"
          >
            <Trash className="size-4" />
            Delete All
          </button>

          <button
            onClick={openCreateModal}
            className="btn flex gap-1 items-center btn-custom-primary"
            title="Create new ticket"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Ticket</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2 text-sm">
        {statusList.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 border-b-2 cursor-pointer transition-colors duration-200  ${filter === tab
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-500 hover:text-blue-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoadingTickets ? (
          <div className="flex flex-row text-center justify-center col-span-full text-gray-500 p-2">
            <Loader className="size-6 animate-spin mr-2" />
            <span>Loading</span>
          </div>
        ) : (
          <>
            {visibleTickets.length > 0 ? (
              <table className="table w-full">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Assigned To</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Latest Message</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td>{ticket.userId?.fullName}</td>
                      <td>{ticket?.staffId?.fullName || "(none)"}</td>
                      <td>{ticket.category}</td>
                      <td>(change this, add time date)</td>
                      <td className="space-x-2">
                        <span>{ticket.status}</span>
                        <br />
                        {ticket.status !== "In Progress" && (
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() => updateTicketStatus(ticket._id, "In Progress")}
                            title="Mark as In Progress"
                          >
                            <Clock className="size-5" />
                          </button>
                        )}
                        {ticket.status !== "Resolved" && (
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => updateTicketStatus(ticket._id, "Resolved")}
                            title="Mark as Resolved"
                          >
                            <CheckCheck className="size-5" />
                          </button>
                        )}
                      </td>
                      <td className="text-center space-x-2">
                        <button className="btn btn-md btn-custom-primary-light"
                          onClick={() => { handleChat(ticket) }}    // To-do (Link the chat to the ticket id)
                          title="Chat"
                        >
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No tickets found.
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
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
  );
};

export default TicketManagerPage;
