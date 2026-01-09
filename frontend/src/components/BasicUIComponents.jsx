import { ArrowDown } from "lucide-react";

export const preloadHeroImage = () => {
  const img = new Image();
  img.src = "/hero-banner.jpg";
};

// Input.jsx
export const Input = ({ type="text", name, placeholder, value, onChange, className }) => {
  return (  
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

// Card.jsx
export const Card = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
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

export const ScrollToBottom = ({ visible, onClick }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      <ArrowDown className="size-5" />
    </button>
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

  let normalizedValue = value;
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split("/");
    normalizedValue = `${year}-${month}-${day}`;
  }

  const date = new Date(normalizedValue);
  if (isNaN(date.getTime())) {
    console.warn("⚠️ Invalid date passed to DateTimeFormatter:", value);
    return null;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Custom format for banner display
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const formatPresets = {
    full: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
    fullNumeric: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
    simple: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    timeOnly: {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
    numeric: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    },
    banner: {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    },
    preview: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    },
  };

  let displayText;

  if (format === "banner") {
    if (isToday) displayText = "Today";
    else if (isYesterday) displayText = "Yesterday";
    else {
      displayText = date.toLocaleDateString(locale, {
        timeZone,
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    }
  } else if (format === "preview") {
    if (isToday) {
      displayText = date.toLocaleTimeString(locale, {
        timeZone,
        ...formatPresets.timeOnly
      });
    } 
    else if (isYesterday) displayText = "Yesterday";
    else {
      displayText = date.toLocaleDateString(locale, {
        timeZone,
        ...formatPresets.preview
      });
    }
  } else {
    displayText = date.toLocaleString(locale, {
      timeZone,
      ...(formatPresets[format] || formatPresets.full),
      ...options,
    });
  }

  return <time dateTime={date.toISOString()}>{displayText}</time>;
};
