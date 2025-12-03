import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { preloadHeroImage } from "./components/BasicUIComponents";

import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import ChatbotPage from "./pages/ChatbotPage";
import AccountsManagerPage from "./pages/AccountsManagerPage";
import AddNewArticlePage from "./pages/AddNewArticlePage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import LiveChatPage from "./pages/LiveChatPage";
import TicketChatPage from "./pages/TicketChatPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect (() => {
    checkAuth();
    if (authUser) {
      preloadHeroImage();
    }
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) 
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
  );

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Navbar is only shown when user is authenticated */}
      {authUser && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        {/* <Route path="/forget-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} /> */}
        
        {/* Protected Routes */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/chatbot" element={authUser ? <ChatbotPage /> : <Navigate to="/login" />} />
        <Route path="/live-chat" element={ authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/knowledgebase" element={authUser ? <KnowledgeBasePage /> : <Navigate to="/login" />} />
        <Route path="/add-new-article" element={authUser ? <AddNewArticlePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={ authUser ? <AccountsManagerPage /> : <Navigate to="/login" />} />

        {/* TO-DO */}
        <Route path="/ticket-chats" element={ authUser ? <LiveChatPage /> : <Navigate to="/login" />} />
        <Route path="/ticket/:ticketId/chat" element={ authUser ? <TicketChatPage /> : <Navigate to="/login" />} />
        {/* <Route path="/ticket" element={ authUser ? <LiveChatPage /> : <Navigate to="/login" />} /> */}


        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster/>
    </div>
  );
};
export default App;