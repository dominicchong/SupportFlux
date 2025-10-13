import Navbar from "./components/Navbar";
import LiveChatPage from "./pages/LiveChatPage";
import SignUpPage from "./pages/SignUpPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import ChatbotPage from "./pages/ChatbotPage";
import AccountsManagementPage from "./pages/AccountsManagementPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import AddNewArticlePage from "./pages/AddNewArticle";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect (() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) 
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
  );

  return (
    <div data-theme={theme} className="min-h-screen overflow-y-auto">
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
        <Route path="/live-chat" element={ authUser ? <LiveChatPage /> : <Navigate to="/login" />} />
        <Route path="/knowledgebase" element={authUser ? <KnowledgeBasePage /> : <Navigate to="/login" />} />
        <Route path="/add-new-article" element={authUser ? <AddNewArticlePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={ authUser ? <AccountsManagementPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  );
};
export default App;