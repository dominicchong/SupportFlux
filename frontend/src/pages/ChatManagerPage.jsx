import { useState, useEffect } from "react";
import { useTicketStore } from "../store/useTicketStore";
import { Search, Plus, Trash, CheckCheck, Clock } from "lucide-react";
import { Input } from "../components/BasicUIComponents"

const ChatManagerPage = () => {
  const { tickets, fetchAllTickets, updateTicketStatus, filter, setFilter, 
    filteredTickets, createTicket, getCategories, deleteAllTickets } = useTicketStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ category: "" });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  const visibleTickets = filteredTickets();
  const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const statusList = ["All", "New", "In Progress", "Resolved"];
  const ticketCategories = ["All", ...getCategories()];

  const openCreateModal = () => {
    setFormState({ category: "" });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.category) {
      alert("All fields are required");
      return;
    }
    try {
      await createTicket(formState);
      setIsModalOpen(false);
    } catch {
      /* toast handled in store */
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete all tickets?")) return;
    setIsDeleting(true);

    try {
      await deleteAllTickets(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      fetchAllTickets();
    }
  };

  return (
    <div className="p-6 pt-20 w-full mx-auto max-w-5xl space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Ticket Manager</h2>

        <button
          onClick={openCreateModal}
          className="btn flex gap-1 items-center btn-custom-primary"
          title="Create new ticket"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Ticket</span>
        </button>

        <button
          onClick={(e) => handleDelete() }
          className="btn flex p-1 rounded hover:bg-base-200 transition bg-red-400 cursor-pointer"
          title="Delete all tickets"
        >
          <Trash className="size-4" />
          Delete All
        </button>
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
                  <td>{ticket.userId?.fullName || "Unknown"}</td>
                  <td>{ticket?.staffId?.fullName || "(none)"}</td>
                  <td>{ticket.category}</td>
                  <td>(change this, add time date)</td>
                  <td className="space-x-2">
                    <span>{ticket.status}</span>
                    <br/>
                    {ticket.status !== "In Progress" && (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => updateTicketStatus(ticket._id, "In Progress")}
                        title="Mark as In Progress"
                      >
                        <Clock className="size-5"/>
                      </button>
                    )}
                    {ticket.status !== "Resolved" && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => updateTicketStatus(ticket._id, "Resolved")}
                        title="Mark as Resolved"
                      >
                        <CheckCheck className="size-5"/>
                      </button>
                    )}
                  </td>
                  <td className="text-center space-x-2">
                    <button className="btn btn-md btn-custom-primary-light"
                      onClick={() => { }}    // To-do (Link the chat to the ticket id)
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">
              <span>New Ticket</span>
            </h2>

            <div className="space-y-3">
              {/* Category selector and custom input */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="select select-bordered w-full"
                  value={isNewCategory ? "__new" : formState.category || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__new") {
                      setIsNewCategory(true);
                      handleFormField("category", "");
                    } else {
                      setIsNewCategory(false);
                      handleFormField("category", val);
                    }
                  }}
                >
                  <option value="">Select category</option>
                  {ticketCategories.filter((item) => item !== "All").map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  <option value="__new">+ Add new...</option>
                </select>

                {isNewCategory && (
                  <Input
                    placeholder="New category"
                    value={formState.category}
                    onChange={(e) => handleFormField("category", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn btn-custom-primary">
                <span>Create</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagerPage;
