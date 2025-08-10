import { useState, useEffect } from "react";
import { Input } from "../components/BasicUIComponents";
import { Pencil, Trash, Plus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const AccountsManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    role: "student",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);

  const { users, fetchUsers, saveUser, deleteUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormState({ fullName: "", email: "", role: "student", password: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormState({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "student",
      password: "", // Password is optional for editing
    });
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formState.fullName.trim() || !formState.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      await saveUser(editingId, formState);
      setIsModalOpen(false);
      setFormState({ fullName: "", email: "", role: "student", password: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="p-6 pt-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Accounts</h2>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus className="size-4" /> <span className="ml-1">Add User</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {users.length > 0 ? (
          <table className="table w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="text-left px-4 py-3 hover:bg-gray-100 transition">Name</th>
                <th className="text-left px-4 py-3 hover:bg-gray-100 transition">Email</th>
                <th className="text-left px-4 py-3 hover:bg-gray-100 transition">Role</th>
                <th className="text-left px-4 py-3 hover:bg-gray-100 transition">Created At</th>
                <th className="text-left px-4 py-3 hover:bg-gray-100 transition">Updated At</th>
                <th className="text-center px-4 py-3 hover:bg-gray-100 transition">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {new Date(user.createdAt).toLocaleString("en-MY", {
                      timeZone: "Asia/Kuala_Lumpur",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // or false if you want 24-hour format
                    })}
                  </td>
                  <td>
                    {new Date(user.updatedAt).toLocaleString("en-MY", {
                      timeZone: "Asia/Kuala_Lumpur",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // or false if you want 24-hour format
                    })}
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="btn btn-sm"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-sm btn-error"
                      title="Delete"
                    >
                      <Trash className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500">No users found.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">{editingId ? "Edit User" : "Create User"}</h2>

            <div className="space-y-2">
              <select
                name="role"
                value={formState.role}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formState.fullName}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                placeholder={editingId ? "New Password (optional)" : "Password"}
                type="password"
                value={formState.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManagementPage;
