import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { preloadHeroImage } from "./components/BasicUIComponents";
import { ROUTES } from "./constants/paths";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

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
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import TicketManagerPage from "./pages/TicketManagerPage";

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
    <div className="min-h-screen">
      {/* Navbar is only shown when user is authenticated */}
      {authUser && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.SIGNUP} element={!authUser ? <SignUpPage /> : <Navigate to={ROUTES.HOME} />} />
        <Route path={ROUTES.LOGIN} element={!authUser ? <LoginPage /> : <Navigate to={ROUTES.HOME} />} />
        
        {/* Protected Routes */}
        <Route path={ROUTES.HOME} element={authUser ? <HomePage /> : <Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.CHATBOT} element={authUser ? <ChatbotPage /> : <Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.LIVE_CHAT} element={ authUser ? <LiveChatPage /> : <Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.KNOWLEDGE_BASE} element={authUser ? <KnowledgeBasePage /> : <Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.PROFILE} element={ authUser ? <ProfilePage /> : <Navigate to={ROUTES.LOGIN} />} />

        <Route path={ROUTES.ACCOUNTS} element={ 
            <ProtectedRoute authUser={authUser} requiredPermission="ACCOUNT_MANAGER">
              <AccountsManagerPage />
            </ProtectedRoute>
          } 
        />

        {/* TO-DO */}
        <Route path={ROUTES.CHAT_MANAGER} element={ 
            <ProtectedRoute authUser={authUser} requiredPermission="CHAT_MANAGER">
              <TicketManagerPage />
            </ProtectedRoute>
          } 
        />
        <Route path={ROUTES.TICKET_CHAT} element={ 
            <ProtectedRoute authUser={authUser} requiredPermission="TICKET_TO_CHAT">
              <TicketChatPage />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_AUTHORIZED} element={<NotAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster/>
    </div>
  );
};
export default App;