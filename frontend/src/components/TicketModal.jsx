import { useState, useEffect } from "react";
import GeneralModal from "./GeneralModal";
import { Input } from "./BasicUIComponents";

const TicketModal = ({isOpen, onClose, formState, handleFormField, 
  handleSubmit, ticketCategories, levelList
}) => {

  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsNewCategory(false); // reset to default
    }
  }, [isOpen]);

  return (
    <GeneralModal
      isOpen={isOpen}
      onClose={onClose}
      title="New Ticket"
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
          <option value="" disabled className="text-gray-500">Select category</option>
          {ticketCategories
            .filter((item) => item !== "All")
            .map((item) => (
              <option key={item} value={item} className="text-black">
                {item}
              </option>
            ))}
          <option value="__new" className="text-black">+ Add new...</option>
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
          <option  value="" disabled className="text-gray-500">Select level of study</option>
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
