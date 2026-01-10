import { useState, useEffect } from "react";
import GeneralModal from "./GeneralModal";
import { useCategoryStore } from "../store/useCategoryStore";

const TicketModal = ({ isOpen, onClose, formState, handleFormField,
  handleSubmit, levelList
}) => {
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    if (isOpen) {
      getCategories();
    }
  }, [isOpen, categories.length, getCategories]);

  return (
    <GeneralModal
      isOpen={isOpen}
      onClose={onClose}
      title="New Chat"
      actions={
        <>
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-custom-primary">
            <span>Create</span>
          </button>
        </>
      }
    >
      {/* Category Selector */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Category</label>

        <select
          className={`select select-bordered w-full 
            ${!formState.category ? "text-gray-500" : "text-black"}`}
          value={formState.category || ""}
          onChange={(e) => handleFormField("category", e.target.value)}
        >
          <option value="" disabled className="text-gray-500">Select category</option>

          {/* Directly get the categories from the store object */}
          {categories.map((cat) => (
            <option key={cat._id} value={cat.category} className="text-black">
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Level</label>

        <select
          className={`select select-bordered w-full 
            ${!formState.level ? "text-gray-500" : "text-black"}`}
          value={formState.level || ""}
          onChange={(e) => {
            const val = e.target.value;
            handleFormField("level", val);
          }}
        >
          <option value="" disabled className="text-gray-500">Select level of study</option>
          {levelList
            .filter((item) => item !== "All")
            .map((item) => (
              <option key={item} value={item} className="text-black">
                {item}
              </option>
            ))}
        </select>
      </div>
    </GeneralModal>
  );
};

export default TicketModal;
