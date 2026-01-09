import { useState, useEffect, useMemo } from "react";
import { Input } from "../components/BasicUIComponents";
import { Pencil, Trash, Loader, ArrowUp, ArrowDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import DateTimeFormatter from "../components/DateTimeFormatter";
import ConfirmationModal from "../components/ConfirmationModal";
import { SearchInput } from "../components/SearchInput";

const AccountsManagerPage = () => {
  const { users, fetchUsers, saveUser, deleteUser, isLoadingUsers } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "fullName", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    role: "student",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // Delay 300ms

    return () => clearTimeout(handler); // Cleanup if user types again before 300ms
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = selectedRole === "All" || user.role === selectedRole;
      const searchStr = debouncedSearch.toLowerCase();
      const matchesSearch =
        (user.fullName?.toLowerCase().includes(searchStr) ?? false) ||
        (user.email?.toLowerCase().includes(searchStr) ?? false);

      return matchesRole && matchesSearch;
    });
  }, [users, debouncedSearch, selectedRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the users list
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers]; // Don't mutate original state
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Helper for icons
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ArrowUp className="size-3 inline ml-1" /> : <ArrowDown className="size-3 inline ml-1" />;
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

  const validateForm = (formData) => {
    if (!formData.role.trim()) {
      toast.error("Role is required");
      return false;
    }
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!editingId) {
      if (!formData.password) {
        toast.error("Password is required");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = validateForm(formState);
    if (!isValid) return;

    try {
      await saveUser(editingId, formState);
      setIsModalOpen(false);
      setFormState({ fullName: "", email: "", role: "student", password: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser._id);
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-6 pt-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-row justify-between gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-semibold">Accounts Manager</h2>
          <h3 className="text-sm font-light text-base-content">
            {filteredUsers.length} users found
          </h3>
        </div>

        <div className="flex">
          <button onClick={openCreateModal} className="btn btn-custom-primary shrink-0">
            <span>New User</span>
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mb-4">
        <div className="flex-1 max-w-100">
          <SearchInput
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            placeholder="Search name or email..."
          />
        </div>

        <select
          className="select select-bordered w-30"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoadingUsers ? (
          <div className="flex flex-row text-center justify-center col-span-full text-gray-500 p-2">
            <Loader className="size-6 animate-spin mr-2" />
            <span>Loading</span>
          </div>
        ) : (
          <>
            {sortedUsers.length === 0 ? (
              <div className="text-center text-gray-500">No users found.</div>
            ) : (
              <table className="table w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th onClick={() => requestSort("fullName")} className="cursor-pointer hover:bg-gray-300 transition px-4 py-3">
                      Name {getSortIcon("fullName")}
                    </th>
                    <th onClick={() => requestSort("email")} className="cursor-pointer hover:bg-gray-300 transition px-4 py-3">
                      Email {getSortIcon("email")}
                    </th>
                    <th onClick={() => requestSort("role")} className="cursor-pointer hover:bg-gray-300 transition px-4 py-3">
                      Role {getSortIcon("role")}
                    </th>
                    <th onClick={() => requestSort("createdAt")} className="cursor-pointer hover:bg-gray-300 transition px-4 py-3">
                      Created At {getSortIcon("createdAt")}
                    </th>
                    <th onClick={() => requestSort("updatedAt")} className="cursor-pointer hover:bg-gray-300 transition px-4 py-3">
                      Updated At {getSortIcon("updatedAt")}
                    </th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td className="capitalize">{user.role}</td>
                      <td>
                        <DateTimeFormatter value={user.createdAt} format="simple" />
                      </td>
                      <td>
                        <DateTimeFormatter value={user.updatedAt} format="simple" />
                      </td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="btn btn-sm btn-accent"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setIsModalDeleteOpen(true);
                          }}
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
            )}
          </>
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
                className="select select-bordered max-w-50"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <Input
                className="w-75"
                name="fullName"
                placeholder="Full Name"
                value={formState.fullName}
                onChange={handleInputChange}
              />
              <Input
                className="w-75"
                type="email"
                name="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleInputChange}
              />
              <Input
                className="w-75"
                type="password"
                name="password"
                placeholder={editingId ? "New Password (optional)" : "Password"}
                value={formState.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn btn-custom-primary">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title="Confirmation"
        children={`Delete this user (${selectedUser?.fullName})?`}
        primaryButton={{ label: "Delete", onClick: handleDelete }}
        primaryButtonStyle={"bg-red-500 border-red-500 hover:bg-red-600 text-white"}
        secondaryButton={{ label: "Cancel", onClick: () => setIsModalDeleteOpen(false) }}
      ></ConfirmationModal>
    </div>
  );
};

export default AccountsManagerPage;
