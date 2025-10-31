import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from "react-router-dom";
import { Headset, Users, Home, Bot, MessageCircleMore, BookOpen, CircleUser, Menu, X } from "lucide-react";
import UnreadBadge from './UnreadBadge';

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = authUser?.role === "admin";
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Messages
  const { unreadCount, getUnreadCounts, subscribeToMessages } = useChatStore();
  const totalUnread = useMemo(
    () => Object.values(unreadCount).reduce((a, b) => a + b, 0),
    [unreadCount]
  );

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
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
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
            <Link to="/accounts" className="btn btn-sm gap-2 hidden lg:flex">
              <Users className="size-5" />
              <span>Accounts</span>
            </Link>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {authUser && (
              <>
                <Link to="/" className="btn btn-sm gap-2">
                  <Home className="size-5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <Link to="/chatbot" className="btn btn-sm gap-2">
                  <Bot className="size-5" />
                  <span className="hidden sm:inline">Chatbot</span>
                </Link>

                <div className="relative inline-block">
                  <Link to="/live-chat" className="btn btn-sm gap-2">
                    <MessageCircleMore className="size-5" />
                    <span className="hidden sm:inline">Live Chat</span>
                  </Link>
                  <UnreadBadge count={totalUnread} className="absolute -top-2 -right-1"/>
                </div>

                <Link to="/knowledgebase" className="btn btn-sm gap-2">
                  <BookOpen className="size-5" />
                  <span className="hidden sm:inline">Knowledge Base</span>
                </Link>

                <Link to="/profile" className="btn btn-sm gap-2">
                  <CircleUser className="size-5" />
                  <span className="hidden sm:inline">
                    {authUser ? `${authUser.fullName}` : "Profile"}
                  </span>
                </Link>
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
              <Link to="/" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                <Home className="size-5" />
                Home
              </Link>

              <Link to="/chatbot" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                <Bot className="size-5" />
                Chatbot
              </Link>

              <Link to="/live-chat" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                <MessageCircleMore className="size-5" />
                Live Chat
                <UnreadBadge count={totalUnread} className="ml-2"/>
              </Link>

              <Link to="/knowledgebase" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                <BookOpen className="size-5" />
                Knowledge Base
              </Link>

              {isAdmin && (
                <Link to="/accounts" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                  <Users className="size-5" />
                  Accounts
                </Link>
              )}

              <Link to="/profile" className="btn btn-m w-full justify-start" onClick={() => setMenuOpen(false)}>
                <CircleUser className="size-5" />
                {authUser ? `${authUser.fullName}` : "Profile"}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;