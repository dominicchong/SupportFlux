import React, { useState, useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

const CategoryManagementModal = ({ isOpen, onClose }) => {
  const { categories, getCategories, createCategory, updateCategory, deleteCategory, isLoading } = useCategoryStore();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (isOpen) getCategories();
  }, [isOpen, categories.length, getCategories]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    const success = await createCategory({ category: newCategoryName });
    if (success) setNewCategoryName("");
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    const success = await updateCategory(id, { category: editValue });
    if (success) setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open overflow-y-auto">
      <div className="modal-box max-w-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Manage Categories</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost"><X className="size-5" /></button>
        </div>

        {/* Create Input */}
        <div className="flex gap-2 mb-6">
          <div className="flex flex-col gap-1 flex-1">
            <input
              type="text"
              maxLength={30}
              className="input input-bordered w-full bg-white text-gray-800"
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <span className="text-[15px] text-gray-400 text-right">
              {newCategoryName.length}/30 characters
            </span>
          </div>
          <button onClick={handleCreate} className="btn btn-primary" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin size-4" /> : <Plus className="size-4" />}
          </button>
        </div>

        {/* Category List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              {editingId === cat._id ? (
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      maxLength={30}
                      className="input input-sm input-bordered w-full bg-white"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <span className="text-[15px] text-gray-400 text-right">
                      {editValue.length}/30
                    </span>
                  </div>
                  <button onClick={() => handleUpdate(cat._id)} className="btn btn-sm btn-success">
                    <Check className="size-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn btn-sm btn-ghost">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-700 font-medium">{cat.category}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(cat._id); setEditValue(cat.category); }}
                      className="btn btn-xs btn-ghost text-blue-600"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="btn btn-xs btn-ghost text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default CategoryManagementModal;