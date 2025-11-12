import { useState, useEffect } from "react";
import { useTicketStore } from "../store/useTicketStore";
import { Search, Plus, Pencil, Trash } from "lucide-react";


const ChatManagerPage = () => {
  const { tickets, fetchAllTickets, markAsResolved, markAsInProgress, 
    filter, setFilter, filteredTickets } = useTicketStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ title: "", description: "", category: "" });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  const visibleTickets = filteredTickets();
  const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const statusList = ["all", "new", "in progress", "resolved"];

  const openCreateModal = () => {
    setFormState({ category: "", status: "" });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

    const openEditModal = (item) => {
    setFormState({ title: item.title, description: item.description, category: item.category });
    setEditingId(item._id);
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.title || !formState.description || !formState.category) {
      alert("All fields are required");
      return;
    }
    try {
      editingId
        ? await updateKnowledge(editingId, formState)
        : await createKnowledge(formState);
      setIsModalOpen(false);
    } catch {
      /* toast handled in store */
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    setIsDeleting(true);

    try {
      await deleteKnowledge(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 pt-20 w-full mx-auto max-w-5xl space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Ticket Manager</h2>

        <button
          onClick={openCreateModal}
          className="btn flex gap-1 items-center btn-custom-primary"
          title="Add a new ticket"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Ticket</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2 text-sm">
        {statusList.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 border-b-2 ${
              filter === tab
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500"
            }`}
          >
            {capitalizeWords(tab)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {visibleTickets.length > 0 ? (
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td>{ticket.studentId?.fullName || "Unknown"}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.status}</td>
                  <td className="text-center space-x-2">
                    {ticket.status !== "resolved" && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => markAsResolved(ticket._id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {ticket.status !== "in progress" && (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => markAsInProgress(ticket._id)}
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button className="btn btn-xs btn-primary">
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
              {editingId ? "Edit Article" : "Create Article"}
            </h2>

            <div className="space-y-3">
              {/* Title input */}
              <Input
                placeholder="Title"
                value={formState.title}
                onChange={(e) => handleFormField("title", e.target.value)}
                autoFocus
              />

              {/* Description input */}
              <textarea
                placeholder="Description"
                value={formState.description}
                onChange={(e) => handleFormField("description", e.target.value)}
                className="textarea textarea-bordered w-full h-24 resize-none"
              />

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
                  {categories.filter((item) => item !== "All").map((item) => (
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
