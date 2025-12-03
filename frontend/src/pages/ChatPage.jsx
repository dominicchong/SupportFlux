import { useAuthStore } from "../store/useAuthStore";
import TicketManagerPage from "./TicketManagerPage";
import LiveChatPage from "./LiveChatPage";

const ChatPage = () => {
  const { isUserAuthorized } = useAuthStore();
  const isAuthorized = isUserAuthorized();

  if (isAuthorized) {
    return <TicketManagerPage />;
  }

  return <LiveChatPage />;
}

export default ChatPage;