import { useEffect } from 'react';
import SidebarChat from '../components/SidebarChat';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import { useTicketStore } from '../store/useTicketStore';

const LiveChatPage = () => {
  const { selectedTicket, setSelectedTicket } = useTicketStore();

  useEffect(() => {
    // When user leaves the page, deselect user chat
    return () => {
      setSelectedTicket(null);
    };
  }, []);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className={`${selectedTicket ? "hidden sm:flex" : "flex sm:flex"} w-full xs:w-full sm:w-72 md:w-80 lg:w-88 flex-shrink-0`}>
              <SidebarChat />
            </div>

            <div className={`${selectedTicket ? "flex sm:flex" : "hidden sm:flex"} flex-1`}>
              {!selectedTicket ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LiveChatPage