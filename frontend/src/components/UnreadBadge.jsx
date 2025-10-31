const UnreadBadge = ({ count, className = "" }) => {
  if (!count || count <= 0) return null;

  return (
    <span className={`w-5 h-5 bg-purple-600 text-white text-xs font-semibold 
                    rounded-full flex items-center justify-center ${className}`}>
      {count > 9 ? "9+" : count}
    </span>
  );
};

export default UnreadBadge;
