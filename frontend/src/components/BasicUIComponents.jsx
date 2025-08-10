// Input.jsx
export const Input = ({ name, placeholder, value, onChange, className }) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

// Card.jsx
export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Badge.jsx
export const Badge = ({ children, variant = "default", className = "", onClick }) => {
  const baseStyle =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium cursor-pointer";

  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-blue-500 text-blue-500",
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <span onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DateTimeFormatter = ({
  value,
  locale = "en-MY",
  timeZone = "Asia/Kuala_Lumpur",
  format = "full",
  options = {},
}) => {
  if (!value) return null;

  const date = new Date(value);

  const formatPresets = {
    full: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    fullNumeric: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    simple: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    timeOnly: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  };

  const formatOptions = {
    ...formatPresets[format] || formatPresets.full,
    ...options,
  };

  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleString(locale, { timeZone, ...formatOptions })}
    </time>
  );
};
