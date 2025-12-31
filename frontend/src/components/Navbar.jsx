import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Headset, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { NAV_ITEMS } from "../constants/navConfig";
import { NavbarItem } from "./NavbarItem";

const Navbar = () => {
  const { authUser, isUserAuthorized, isAdmin } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { subscribeToMessages } = useChatStore();

  useEffect(() => {
    subscribeToMessages();

    const handleClickOutside = (e) => {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [authUser, subscribeToMessages, menuOpen]);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 w-full">
        {/* LEFT */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Headset className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">SupportFlux</h1>
          </Link>

          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1.5 rounded-md font-medium capitalize">
            {authUser ? `${authUser.role}` : "Guest"}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center flex-shrink-0">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map(item => (
              <NavbarItem
                key={typeof item.label === "function" ? item.to : item.label}
                item={item}
                authUser={authUser}
                isUserAuthorized={isUserAuthorized}
                setMenuOpen={setMenuOpen}
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            className="lg:hidden flex items-center gap-2 btn btn-sm px-3 py-2"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden absolute right-4 top-16 bg-base-100 border border-base-300 rounded-xl shadow-lg flex flex-col items-start px-4 py-3 space-y-2 w-56"
        >
          {NAV_ITEMS.map(item => (
            <NavbarItem
              key={typeof item.label === "function" ? item.to : item.label}
              item={item}
              authUser={authUser}
              isUserAuthorized={isUserAuthorized}
              setMenuOpen={setMenuOpen}
              isMobile={true}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;