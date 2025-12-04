import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Headset, Users, Home, Bot, MessageCircleMore, BookOpen, CircleUser, Menu, X } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = authUser?.role === "admin";
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Messages
  const { getUnreadCounts, subscribeToMessages } = useChatStore();
  

  // Close menu when clicking outside
  useEffect(() => {
    if (authUser) {
      getUnreadCounts();       // loads unread msg counts when sign in
      subscribeToMessages();   // listen for new messages in real-time
    }

    const handleClickOutside = (e) => {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) {
        return;
      }
      setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [authUser, getUnreadCounts, subscribeToMessages, menuOpen]);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg shadow-xs">
      <div className="flex items-center justify-between h-16
                      px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 w-full">
        {/* LEFT SECTION */}
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

          {isAdmin && (
            <NavLink
              to="/accounts"
              className={({ isActive }) => `btn btn-sm gap-2 hidden lg:flex ${isActive ? "btn-primary" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <Users className="size-5" />
              <span>Accounts</span>
            </NavLink>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {authUser && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => `btn btn-sm gap-2 ${isActive ? "btn-primary" : ""}`}
                >
                  <Home className="size-5" />
                  <span className="hidden sm:inline">Home</span>
                </NavLink>

                <NavLink
                  to="/chatbot"
                  className={({ isActive }) => `btn btn-sm gap-2 ${isActive ? "btn-primary" : ""}`}
                >
                  <Bot className="size-5" />
                  <span className="hidden sm:inline">Chatbot</span>
                </NavLink>

                <div className="relative inline-block">
                  <NavLink
                    to="/live-chat"
                    className={({ isActive }) => `btn btn-sm gap-2 ${isActive ? "btn-primary" : ""}`}
                  >
                    <MessageCircleMore className="size-5" />
                    <span className="hidden sm:inline">Live Chat</span>
                  </NavLink>
                </div>

                <NavLink
                  to="/knowledgebase"
                  className={({ isActive }) => `btn btn-sm gap-2 ${isActive ? "btn-primary" : ""}`}
                >
                  <BookOpen className="size-5" />
                  <span className="hidden sm:inline">Knowledge Base</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) => `btn btn-sm gap-2 ${isActive ? "btn-primary" : ""}`}
                >
                  <CircleUser className="size-5" />
                  <span className="hidden sm:inline">
                    {authUser ? `${authUser.fullName}` : "Profile"}
                  </span>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button" // prevents form submit side effects
            className="lg:hidden flex items-center gap-2 btn btn-sm px-3 py-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div 
          ref={menuRef}
          className={`lg:hidden absolute right-4 top-16 bg-base-100 border border-base-300 rounded-xl shadow-lg flex flex-col items-start px-4 py-3 space-y-2 w-56 transition-all duration-300 ease-in-out 
            ${menuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
          }`}>
          
          {authUser && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Home className="size-5" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/chatbot"
                className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Bot className="size-5" />
                <span>Chatbot</span>
              </NavLink>

              <NavLink
                to="/live-chat"
                className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircleMore className="size-5" />
                <span>Live Chat</span>
              </NavLink>

              <NavLink
                to="/knowledgebase"
                className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <BookOpen className="size-5" />
                <span>Knowledge Base</span>
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/accounts"
                  className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Users className="size-5" />
                  <span>Accounts</span>
                </NavLink>
              )}

              <NavLink
                to="/profile"
                className={({ isActive }) => `btn btn-m w-full justify-start ${isActive ? "btn-primary" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <CircleUser className="size-5" />
                {authUser ? `${authUser.fullName}` : "Profile"}
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;