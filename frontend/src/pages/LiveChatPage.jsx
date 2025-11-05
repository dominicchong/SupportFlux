import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

const LiveChatPage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    // When user leaves the page, deselect user chat
    return () => {
      setSelectedUser(null);
    };
  }, [setSelectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className={`${selectedUser ? "hidden sm:flex" : "flex sm:flex"} w-full xs:w-full sm:w-72 md:w-80 lg:w-88 flex-shrink-0`}>
              <Sidebar />
            </div>

            <div className={`${selectedUser ? "flex sm:flex" : "hidden sm:flex"} flex-1`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LiveChatPage