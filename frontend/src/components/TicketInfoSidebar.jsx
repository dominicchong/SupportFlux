import { Info, User, Tag, Clock, GraduationCap } from "lucide-react";
import TicketStatusBadge from "./utils/TicketStatusBadge";
import { useTicketStore } from "../store/useTicketStore";
import DateTimeFormatter from "./DateTimeFormatter";
import { getAvatarBg, getInitials } from "./Avatar";

const TicketInfoSidebar = () => {
  const { selectedTicket, getSimpleTicketId, isInfoSidebarOpen } = useTicketStore();

  if (!selectedTicket || !isInfoSidebarOpen) return null;
  const simpleTicketId = getSimpleTicketId(selectedTicket._id);

  return (
    <div className="w-55 lg:w-70 border-l border-base-300 bg-base-100 flex flex-col h-full overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-4 lg:px-6 border-b border-base-300 flex items-center gap-2 font-semibold">
        <Info className="size-5" />
        <span>Chat Details</span>
      </div>

      <div className="p-4 lg:px-6 space-y-6">
        {/* Title/Category Section */}
        <div className="space-y-2">
          {/* <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</label> */}
          {selectedTicket.level && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              <GraduationCap className="size-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{selectedTicket.level}</span>
            </div>
          )}

          {/* Category and ticket status */}
          <div className="pl-2">
            <h3 className="text-xl font-bold text-zinc-800 leading-tight">{selectedTicket.category}</h3>
            <div className="mt-2">
              <TicketStatusBadge status={selectedTicket.status} />
            </div>
          </div>
        </div>

        <hr className="border-zinc-300" />

        {/* User Information */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Created By</label>
          <div className="flex items-center gap-3 mt-3">
            <div className={`size-10 rounded-full flex items-center justify-center font-bold 
            overflow-hidden ring-1 ring-zinc-100 ring-offset-1 shadow-sm 
            ${!selectedTicket.userId?.profilePic ? getAvatarBg() : ""}`}>
              
              {selectedTicket.userId?.profilePic ? (
                <img
                  src={selectedTicket.userId?.profilePic}
                  alt="profile"
                  className="size-full object-cover" // Ensures image fills the circle
                />
              ) : (
                <span>{getInitials(selectedTicket.userId?.fullName || "Unknown")}</span>
              )}
            </div>

            <div>
              <p className="font-medium">{selectedTicket.userId?.fullName || "Unknown"}</p>
              <p className="text-sm text-zinc-500 capitalize">{selectedTicket.userId?.role}</p>
            </div>
          </div>

          {selectedTicket.staffId && selectedTicket.staffId?.role !== "student" &&
            <div>
              <div className="pt-4"></div>

              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Staff Involved</label>
              <div className="flex items-center gap-3 mt-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden ring-1 ring-base-200 ring-offset-1 shadow-sm">
                  {selectedTicket.staffId.profilePic ? (
                    <img src={selectedTicket.staffId.profilePic} className="size-full object-cover" alt="staff" />
                  ) : (
                    <span>{selectedTicket.staffId.fullName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedTicket.staffId.fullName}</p>
                  <p className="text-sm text-zinc-500 capitalize">{selectedTicket.staffId.role}</p>
                </div>
              </div>
            </div>
          }
        </div>

        <hr className="border-zinc-300" />

        {/* Additional Metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Tag className="size-4" />
            <span>Chat ID:
              <span className="font-mono text-zinc-400"> #{simpleTicketId}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Clock className="size-4" />
            <span>Opened: <DateTimeFormatter value={selectedTicket.createdAt} format="numeric" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoSidebar;