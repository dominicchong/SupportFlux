import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const { sendMessage, isSendMessageLoading } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <div>
              {/* Small preview image */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-36 sm:w-36 md:w-48 h-auto object-contain rounded-lg border border-gray-200 cursor-pointer"
                onClick={() => setIsOpen(true)}
              />

              {/* Modal for full-size view */}
              {isOpen && (
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={imagePreview}
                    alt="Full Size"
                    className="max-w-2xl max-h-2xl rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -  right-1 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle btn-sm
                     ${imagePreview ? "bg-purple-400 text-white" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSendMessageLoading}
        >
          {isSendMessageLoading ? (
            <Loader2 className="animate-spin size-5 mx-auto" />
          ) : (
            <Send size={22} />
          )}
          
        </button>
      </form>
    </div>
  );
};
export default MessageInput;