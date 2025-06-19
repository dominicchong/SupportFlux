import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash } from "lucide-react";
import { Input, Card, CardContent, Badge } from "../components/BasicUIComponents";
import { useKnowledgeBaseStore } from "../store/useKnowledgeBaseStore";
import { useAuthStore } from "../store/useAuthStore";

const KnowledgeBasePage = () => {
  const {authUser} = useAuthStore();
  const isStaff = authUser?.role === "staff" || authUser?.role === "admin";
  
  const {
    knowledgeData,
    isLoading,
    fetchKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    getCategories,
  } = useKnowledgeBaseStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ title: "", description: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  // Categories and filetered data
  const categories = ["All", ...getCategories()];

  const filteredData = knowledgeData.filter((item) => {
    const byCategory = selectedCategory === "All" || item.category === selectedCategory;
    const byText =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return byCategory && byText;
  });

  const openCreateModal = () => {
    setFormState({ title: "", description: "", category: "" });
    setEditingId(null);
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
    await deleteKnowledge(id);
  };

  
  return (
    <div className="p-6 pt-20 space-y-6 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-5 text-base-content/40" />
          </div>
          <Input
            placeholder="Search information..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        {/* Add Button */}
        {isStaff && (
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex gap-1 items-center"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>


      {/* Filter + list */}
      <div className="flex gap-6">
        {/* Category filter */}
        <div className="w-1/5 space-y-2">
          <h2 className="text-lg font-semibold">Filter by Category</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="w-fit cursor-pointer"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="text-center col-span-full text-gray-500">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center col-span-full text-gray-500">No matching articles found.</div>
          ) : (
            filteredData.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow relative">
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold truncate">{item.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                  <Badge variant="secondary">{item.category}</Badge>
                </CardContent>

                {isStaff && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded hover:bg-base-200 transition"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 rounded hover:bg-base-200 transition text-error"
                      title="Delete"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal (unchanged) … */}
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
                  {categories.filter((cat) => cat !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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

export default KnowledgeBasePage;
