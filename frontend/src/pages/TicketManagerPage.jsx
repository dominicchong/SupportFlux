import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from "../store/useTicketStore";
import { Search, Plus, Trash, CheckCheck, Clock, Loader } from "lucide-react";
import { toastWarning } from "../components/ToastUtils";
import TicketModal from "../components/TicketModal";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { DateTimeFormatter } from "../components/BasicUIComponents";
import UnreadBadge from '../components/UnreadBadge';
import ConfirmationModal from "../components/ConfirmationModal";
import Select from "react-select";

const TicketManagerPage = () => {
  const { authUser, staffList, fetchStaffList } = useAuthStore();
  const { tickets, fetchAllTickets, setSelectedTicket, updateTicketStatus, filter, setFilter, isLoadingTickets,
    statusList, filteredTickets, createTicket, updateTicketStaff, getCategories, deleteAllTickets, levelList, getTicketCountByStatus } = useTicketStore();

  const { unreadCount, getUnreadCounts, latestMessages, getLatestMessages, formatLatestMessages } = useChatStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalStaffOpen, setIsModalStaffOpen] = useState(false);

  useEffect(() => {
    fetchAllTickets();
    getLatestMessages();
    getUnreadCounts();
    fetchStaffList();
  }, [fetchAllTickets, getLatestMessages, getUnreadCounts, fetchStaffList]);

  const defaultNewTicketForm = {
    category: "",
    level: "",
  };

  const defaultAssignStaffForm = {
    ticketId: null, 
    ticketCreatorId: null, 
    staffId: null
  };

  const [formState, setFormState] = useState(defaultNewTicketForm);
  const [assignFormState, setAssignFormState] = useState(defaultAssignStaffForm);

  // const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const visibleTickets = filteredTickets();
  const ticketCategories = ["All", ...getCategories()];
  const navigate = useNavigate();

  const openCreateModal = () => {
    setFormState(defaultNewTicketForm);
    setIsModalOpen(true);
  };

  const handleChat = (ticket) => {
    setSelectedTicket(ticket);
    navigate(`/ticket/${ticket._id}/chat`)
  }

  const handleFormField = (field, val) => setFormState((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!formState.category) {
      toastWarning("Category is required");
      return;
    }

    try {
      await createTicket(formState);
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalOpen(false);
      fetchAllTickets();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete all tickets? \nThis is a permanent action.")) return;
    setIsDeleting(true);

    try {
      await deleteAllTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      fetchAllTickets();
    }
  };

  const handleAssign = async () => {
    const { ticketId, staffId } = assignFormState;
    if (!staffId) {
      toastWarning("Staff is required");
      return;
    }

    try {
      await updateTicketStaff(ticketId, staffId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalStaffOpen(false);
      fetchAllTickets();
    }
  };

  const filteredStaffList = React.useMemo(() => {
    if (!isModalStaffOpen || !assignFormState.ticketCreatorId) {
      return staffList; // return full list before modal is ready
    }

    return staffList.filter((staff) => staff._id !== assignFormState.ticketCreatorId);
  }, [isModalStaffOpen, assignFormState.ticketCreatorId, staffList]);

  const sortedStaffList = React.useMemo(() => {
    if (!filteredStaffList) return [];

    return [...filteredStaffList].sort((a, b) => {
      // Put the current logged in staff(You) at the top of the list and sort other names alphabetically
      if (a._id === authUser._id) return -1;
      if (b._id === authUser._id) return 1;

      return a.fullName.localeCompare(b.fullName);
    });
  }, [filteredStaffList, authUser._id]);

  return (
    <div className="p-6 pt-20 w-full mx-auto max-w-6xl space-y-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold">Chat Manager</h2>

        <div className="flex items-end justify-right space-x-3">
          <button
            onClick={(e) => navigate('/ticket-chats')}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-emerald-400 cursor-pointer"
            title="Navigate to Live Chat"
          >
            Live Chat
          </button>

          <button
            onClick={(e) => handleDelete()}
            className="btn flex p-1 rounded hover:bg-base-200 transition bg-red-400 cursor-pointer"
            title="Delete all tickets"
          >
            <Trash className="size-4" />
            Delete All
          </button>

          <button
            onClick={openCreateModal}
            className="btn flex gap-1 items-center btn-custom-primary"
            title="Create new ticket"
          >
            {/* <Plus className="size-4" /> */}
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2 text-sm">
        {statusList.map((tab) => {
          const count = getTicketCountByStatus(tab);

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 border-b-2 cursor-pointer transition-colors duration-200  ${filter === tab
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-500 hover:text-blue-400"
                }`}
            >
              {tab}
              
              {/* Count badge */}
              <span
                className={`text-xs ml-1 px-2 py-0.5 rounded-full font-medium
                ${filter === tab
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoadingTickets ? (
          <div className="flex flex-row text-center justify-center col-span-full text-gray-500 p-2">
            <Loader className="size-6 animate-spin mr-2" />
            <span>Loading</span>
          </div>
        ) : (
          <>
            {visibleTickets.length > 0 ? (
              <table className="table w-full">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Level</th>
                    <th className="px-4 py-3 text-left">Latest Message</th>
                    <th className="px-4 py-3 text-left">Created By</th>
                    <th className="px-4 py-3 text-left">Assigned To</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td>{ticket.category}</td>
                      <td className="max-w-[150px] truncate whitespace-nowrap overflow-hidden" 
                          title="">
                        {ticket?.level}
                      </td>
                      <td className="max-w-[250px] truncate whitespace-nowrap overflow-hidden"
                        title={formatLatestMessages(ticket._id, authUser._id)}
                      >
                        {formatLatestMessages(ticket._id, authUser._id)} <br />
                        <span className="text-xs text-gray-400">
                          <DateTimeFormatter value={latestMessages?.[ticket._id]?.createdAt} format="preview" />
                        </span>
                      </td>
                      <td>{ticket.userId.fullName}</td>
                      <td>{ticket?.staffId?.fullName || "(none)"}</td>
                      <td className="space-x-2">
                        <span>{ticket.status}</span>
                        <br />
                        {ticket.status !== "In Progress" && (
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() => updateTicketStatus(ticket._id, "In Progress")}
                            title="Mark as In Progress"
                          >
                            <Clock className="size-5" />
                          </button>
                        )}
                        {ticket.status !== "Resolved" && (
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => updateTicketStatus(ticket._id, "Resolved")}
                            title="Mark as Resolved"
                          >
                            <CheckCheck className="size-5" />
                          </button>
                        )}
                      </td>
                      <td className="text-center space-x-2 space-y-1">
                        <div className="relative inline-block">
                          <button className="btn btn-md btn-custom-primary-light"
                            onClick={() => { handleChat(ticket) }}
                            title="Chat"
                          >
                            Chat
                          </button>

                          <UnreadBadge count={unreadCount[ticket._id]} className="absolute -top-2 -right-1" />
                        </div>

                        <button className="btn btn-md btn-custom-primary-light"
                          onClick={() => {
                            setAssignFormState({ ticketId: ticket._id, ticketCreatorId: ticket.userId._id, staffId: null });
                            setIsModalStaffOpen(true);
                          }}    // To-do (Put out a modal to set staff name)
                          title="Assign Staff"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No tickets found.
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formState={formState}
        handleFormField={handleFormField}
        handleSubmit={handleSubmit}
        ticketCategories={ticketCategories}
        levelList={levelList}
      />

      <ConfirmationModal
        isOpen={isModalStaffOpen}
        onClose={() => setIsModalStaffOpen(false)}
        title="Assign Staff"
        primaryButton={{ label: "Assign", onClick: handleAssign }}
        secondaryButton={{ label: "Cancel", onClick: () => setIsModalStaffOpen(false) }}
      >
        <Select
          options={sortedStaffList.map((s) => ({
            value: s._id,
            label: s._id === authUser._id ? `${s.fullName} (You)` : s.fullName
          }))}
          value={sortedStaffList
            .map((s) => ({ value: s._id, label: s._id === authUser._id ? `${s.fullName} (You)` : s.fullName }))
            .find((opt) => opt.value === assignFormState.staffId) || null}
          onChange={(selected) =>
            setAssignFormState((prev) => ({ ...prev, staffId: selected.value }))
          }
          placeholder="Search staff..."
          isSearchable={true}
        />
      </ConfirmationModal>

    </div>
  );
};

export default TicketManagerPage;
