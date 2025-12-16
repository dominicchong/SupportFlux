import React from "react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,        // allows JSX content
  primaryButton,
  primaryButtonStyle,
  secondaryButton,
  size = "w-96"    // optional: control modal width
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg shadow-lg ${size} p-6 relative`}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

        <div className="mb-6">
          {children} {/* render arbitrary JSX content here */}
        </div>

        <div className="flex justify-end space-x-3">
          {secondaryButton && (
            <button
              className="btn border-gray-300"
              onClick={secondaryButton.onClick || onClose}
            >
              {secondaryButton.label || "Cancel"}
            </button>
          )}
          {primaryButton && (
            <button
              className={`btn btn-primary ${primaryButtonStyle}`}
              onClick={primaryButton.onClick}
            >
              {primaryButton.label || "Confirm"}
            </button>
          )}
        </div>

        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
