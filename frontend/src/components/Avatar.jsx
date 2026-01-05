// Get Initials based on user name
export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Default background style
export const getAvatarBg = () => {
  return "bg-primary/10 text-primary"; 
};