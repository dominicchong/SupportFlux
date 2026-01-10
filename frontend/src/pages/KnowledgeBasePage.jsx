import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash, Loader, X, Book, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { Input, Card, CardContent, Badge } from "../components/BasicUIComponents";
import { useKnowledgeBaseStore } from "../store/useKnowledgeBaseStore";
import { useAuthStore } from "../store/useAuthStore";
import DateTimeFormatter from "../components/DateTimeFormatter";
import ConfirmationModal from "../components/ConfirmationModal";

import toast from "react-hot-toast";
import { SearchInput } from "../components/SearchInput";

const KnowledgeBasePage = () => {
  const { isUserAuthorized } = useAuthStore();
  const { knowledgeData, isLoading, fetchKnowledge, createKnowledge,
    updateKnowledge, deleteKnowledge, getCategories } = useKnowledgeBaseStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ title: "", description: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isAuthorized = isUserAuthorized();
  const categories = ["All", ...getCategories()];    // Categories and filtered data

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  // Handle Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // Delay 300ms

    return () => clearTimeout(handler); // Cleanup if user types again before 300ms
  }, [searchTerm]);

  const filteredData = knowledgeData.filter((item) => {
    const byCategory = selectedCategory === "All" || item.category === selectedCategory;
    const byText =
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
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

  const openViewModal = (item) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  };

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.title || !formState.description || !formState.category) {
      toast.error("All fields are required");
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

  const handleDelete = async () => {
    try {
      await deleteKnowledge(selectedItem._id);
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedItem(null);
      setIsDeleting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200 pt-24 pb-8 px-8 mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
            Knowledge Base
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto items-center">
            Search for articles, information, and FAQs related to your studies.
          </p>

          <div className="max-w-3xl mx-auto mt-8 flex flex-row justify-between group items-center">
            <SearchInput
              searchQuery={searchTerm}
              setSearchQuery={setSearchTerm}
              placeholder="Search for articles..."
            />
            {isAuthorized && (
              <button onClick={openCreateModal} className="btn btn-md btn-custom-primary rounded-lg ml-3">
                <Plus className="size-4 mr-1" />
                <span>New</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[95%] mx-auto px-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left side - Sidebar Filter */}
          <aside className="w-full lg:w-1/5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="mr-2 text-lg font-bold text-gray-800">Categories</h2>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedCategory(item)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === item
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-transparent text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span>{item}</span>
                    <ChevronRight className={`hidden lg:inline size-4 ${selectedCategory === item ? "opacity-100" : "opacity-0"}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right side - Cards */}
          <main className="w-full lg:w-4/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-slate-400">Loading...</div>
              ) : (
                filteredData.map((item) => (
                  <Card
                    key={item._id}
                    className="group relative bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-500 rounded-2xl cursor-pointer p-0 overflow-hidden"
                    onClick={() => openViewModal(item)}
                  >
                    {/* Top Accent Bar */}
                    <div className="h-1.5 w-full bg-indigo-100 group-hover:bg-indigo-500 transition-colors" />

                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                        {/* Admin Action Overlay - Visible on Hover */}
                        {isAuthorized && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              title="Edit"
                              onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                              className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              title="Delete"
                              onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsDeleting(true); }}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors truncate">
                          {item.title}
                        </h2>
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                        <div className="flex items-center text-slate-400 text-[11px] font-medium">
                          <Clock className="size-3 mr-1" />
                          <DateTimeFormatter value={item.updatedAt || ""} format="numeric" />
                        </div>

                        {/* Interactive Read More Hint */}
                        <div className="flex items-center text-indigo-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <span>View Article</span>
                          <ArrowRight className="size-4 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
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
                  className="w-[70%]"
                  autoFocus
                />

                {/* Description input */}
                <textarea
                  placeholder="Description"
                  value={formState.description}
                  onChange={(e) => handleFormField("description", e.target.value)}
                  className="textarea textarea-bordered w-full h-36 resize-none"
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
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View modal when an article card is clicked */}
        {isViewModalOpen && viewItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 p-4 sm:p-6 rounded-2xl w-[95%] sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto space-y-4 shadow-xl border border-white/20">
              <div className="flex justify-between items-start gap-4">
                {/* Category */}
                <div className="flex mt-2">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                    {viewItem.category}
                  </span>
                </div>

                {/* Edit + Delete buttons */}
                {isAuthorized && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        openEditModal(viewItem);
                        setIsViewModalOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="size-4 sm:size-5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(viewItem);
                        setIsDeleting(true);
                        setIsViewModalOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash className="size-4 sm:size-5" />
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight break-words whitespace-normal">{viewItem.title}</h2>

              {/* Description */}
              <div className="py-2 border-t border-slate-50">
                <p className="text-sm sm:text-base text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {viewItem.description}
                </p>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Confirmation"
          children={
            <div>
              <span>Delete this article?</span><br />
              <span className="text-sm text-gray-500 line-clamp-2 truncate">
                Title: {selectedItem?.title} <br />
              </span>
            </div>
          }
          primaryButton={{ label: "Delete", onClick: handleDelete }}
          primaryButtonStyle={"bg-red-500 border-red-500 hover:bg-red-600 text-white"}
          secondaryButton={{ label: "Cancel", onClick: () => setIsDeleting(false) }}
        />
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
