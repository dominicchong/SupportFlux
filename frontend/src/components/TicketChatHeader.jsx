import { Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTicketStore } from "../store/useTicketStore";

const TicketChatHeader = () => {
  const { selectedTicket, setSelectedTicket, toggleInfoSidebar, isInfoSidebarOpen } = useTicketStore();
  const navigate = useNavigate();

  const ticketCategory = selectedTicket?.category;

  const handleBack = () => {
    navigate("/chat-manager")
  }

  return (
    <div className="p-2.5 pl-5 border-b border-base-300 bg-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <button
                onClick={handleBack}
                className="btn flex gap-1 items-center justify-center btn-circle btn-ghost"
                title="Back to Chat Manager"
              >
                <ArrowLeft />
              </button>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {ticketCategory}
            </h3>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleInfoSidebar}
          className={`p-2 rounded-md transition-colors cursor-pointer ${isInfoSidebarOpen ? 'bg-primary/10 text-primary' : 'hover:bg-zinc-100'}`}
          title="Toggle Details"
        >
          <Info className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default TicketChatHeader;