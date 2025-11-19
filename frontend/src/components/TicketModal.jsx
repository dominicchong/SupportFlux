import GeneralModal from "./GeneralModal";
import { Input } from "./BasicUIComponents";

const TicketModal = ({
  isOpen,
  onClose,
  formState,
  handleFormField,
  handleSubmit,
  isNewCategory,
  setIsNewCategory,
  ticketCategories,
}) => {
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
          {ticketCategories
            .filter((item) => item !== "All")
            .map((item) => (
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
    </GeneralModal>
  );
};

export default TicketModal;
