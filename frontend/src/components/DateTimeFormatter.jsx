const DateTimeFormatter = ({
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
  } else {
    displayText = date.toLocaleString(locale, {
      timeZone,
      ...(formatPresets[format] || formatPresets.full),
      ...options,
    });
  }

  return <time dateTime={date.toISOString()}>{displayText}</time>;
};

export default DateTimeFormatter;