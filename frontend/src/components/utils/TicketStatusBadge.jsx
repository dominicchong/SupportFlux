export default function TicketStatusBadge({ status, className = "" }) {
  const getStyles = (status) => {
    status = status ? status.toLowerCase() : "";
    switch (status) {
      case "new":
        return "bg-red-600 text-white";
      case "in progress":
        return "bg-yellow-600 text-white";
      case "resolved":
        return "bg-green-600 text-white";
      default:
        return "bg-blue-400 text-white";
    }
  }

  return (
    <div
      className={`
        text-xs font-semibold px-2 py-0.5 rounded-full w-fit mt-1 mb-1
        ${getStyles(status)}
        ${className}
      `}
    >
      {status}
    </div>
  );
}