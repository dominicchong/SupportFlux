import { useAuthStore } from '../store/useAuthStore';
import { Link } from "react-router-dom";
import { Home, Bot, MessageCircleMore, BookOpen, CircleUser, Headset, Users } from "lucide-react";
import {  } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const isAdmin = authUser?.role === "admin";

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Headset className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">SupportFlux</h1>
            </Link>
            <span className="text-sm text-gray-600 font-medium capitalize">
              <span className="bg-purple-100 text-purple-800 px-2 py-1.5 rounded-md">
                {authUser ? `${authUser.role}` : "Guest"}
              </span>
            </span>

            {/* Only admins can manage accounts */}
            {isAdmin && (
              <Link to={"/accounts"} className="btn btn-sm gap-2">
                <Users className="size-5" />
                <span className="hidden sm:inline">Accounts</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/"} className="btn btn-sm gap-2">
                  <Home className="size-5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <Link to={"/chatbot"} className="btn btn-sm gap-2">
                  <Bot className="size-5" />
                  <span className="hidden sm:inline">Chatbot</span>
                </Link> 

                <Link to={"/live-chat"} className="btn btn-sm gap-2">
                  <MessageCircleMore className="size-5" />
                  <span className="hidden sm:inline">Live Chat</span>
                </Link>

                <Link to={"/knowledgebase"} className="btn btn-sm gap-2">
                  <BookOpen className="size-5" />
                  <span className="hidden sm:inline">Knowledge Base</span>
                </Link>

                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <CircleUser className="size-5" />
                  <span className="hidden sm:inline">
                    {authUser ? `${authUser.fullName}` : "Profile"}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;