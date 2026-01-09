import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export const NavbarItem = ({ item, authUser, isUserAuthorized, setMenuOpen, isMobile }) => {
  if (!item.visible({ authUser, isUserAuthorized })) return null;

  const Icon = item.icon;
  const label = typeof item.label === "function" ? item.label(authUser) : item.label;
  const [isSubOpen, setSubOpen] = useState(false);

  const baseClass = isMobile ? "btn btn-m w-full justify-start" : "btn btn-sm";
  const containerRef = useRef(null);
  const openedByClick = useRef(false);

  const visibleChildren = item.children?.filter(
    child => !child.visible || child.visible({ authUser, isUserAuthorized })
  );
  const hasChildren = visibleChildren?.length > 0;
  const location = useLocation();

  const isSubmenuActive =
    visibleChildren?.some(child =>
      location.pathname.startsWith(child.to)
    );

  const handleMouseEnter = () => {
    if (!isMobile && !openedByClick.current) setSubOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile && !openedByClick.current) setSubOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setSubOpen(false);
      }
    };

    if (isSubOpen) { document.addEventListener("mousedown", handleClickOutside); }
    if (!isSubOpen) openedByClick.current = false;
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSubOpen]);

  useEffect(() => {
    if (!isSubmenuActive) {
      setSubOpen(false);
      openedByClick.current = false;
    }
  }, [isSubmenuActive]);


  return (
    <div
      ref={containerRef}
      className="relative flex w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasChildren ? (
        <button
          type="button"
          className={`whitespace-nowrap flex items-center justify-between w-full
             ${baseClass} ${isSubmenuActive ? "btn-primary" : ""}`}
          onClick={() => {
            openedByClick.current = true;
            setSubOpen(prev => !prev);
          }}
        >
          {Icon && <Icon className="size-5" />}
          <span className={isMobile ? "" : "hidden sm:inline"}>{label}</span>

          {isSubOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      ) : (
        <NavLink
          to={item.to}
          className={({ isActive }) => `whitespace-nowrap ${baseClass} ${isActive ? "btn-primary" : ""}`}
          onClick={() => isMobile && setMenuOpen(false)}
        >
          {Icon && <Icon className="size-5" />}
          <span className={isMobile ? "" : "hidden sm:inline"}>{label}</span>
        </NavLink>
      )}

      {hasChildren && isSubOpen && (
        <div className={`absolute top-full left-0 p-1 bg-base-100 shadow-lg rounded-md w-40 z-50 flex flex-col`}>
          {visibleChildren.map(child => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block px-2 py-1 rounded hover:text-purple-700 ${isActive ? "font-medium text-purple-700 bg-purple-100" : "text-gray-500"}`
              }
              onClick={() => {
                setSubOpen(false);
                isMobile && setMenuOpen(false);
              }}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
