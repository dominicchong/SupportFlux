import { useAuthStore } from "../store/useAuthStore";
import TicketManagerPage from "./TicketManagerPage";
import LiveChatPage from "./LiveChatPage";

const ChatPage = () => {
  const { isUserAuthorized } = useAuthStore();
  const isStaff = isUserAuthorized();

  if (isStaff) {
    return <TicketManagerPage />;
  }

  return <LiveChatPage />;
}

export default ChatPage;