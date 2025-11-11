import { useAuthStore } from "../store/useAuthStore";
import ChatManagerPage from "./ChatManagerPage";
import LiveChatPage from "./LiveChatPage";

const ChatPage = () => {
  const { isUserAuthorized } = useAuthStore();
  const isStaff = isUserAuthorized();

  if (isStaff) {
    return <ChatManagerPage />;
  }

  return <LiveChatPage />;
}

export default ChatPage;