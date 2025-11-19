const GeneralModal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        
        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold">
            <span>{title}</span>
          </h2>
        )}

        {/* Form or content */}
        <div className="space-y-3">{children}</div>

        {/* Actions (buttons) */}
        <div className="flex justify-end gap-2 pt-4">
          {actions}
        </div>

      </div>
    </div>
  );
};

export default GeneralModal;
