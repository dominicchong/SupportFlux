import { useEffect, useState, useRef } from 'react';
import {useChatStore} from "../store/useChatStore";
import { useAuthStore } from '../store/useAuthStore';

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput"; 
import MessegeSkeleton from "./skeletons/MessageSkeleton";
import { DateTimeFormatter } from "./BasicUIComponents";

const ChatContainer = () => {
  const {messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, getGroupedMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [activeDate, setActiveDate] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const groupedMessages = getGroupedMessages();

  useEffect(() => {
    if(!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-date-banner]");
    if (!sections.length) return;

    // IntersectionObserver setup
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries to find the topmost visible one
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          const topSection = visibleSections[0].target;
          const newDate = topSection.getAttribute("data-date-banner");
          if (newDate !== activeDate) setActiveDate(newDate);
        }
      },
      {
        root: container,
        threshold: [0, 0.05, 1.0],
        rootMargin: "-40px 0px -90% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [groupedMessages, activeDate]); // 🟩 updated dependency

  // Scroll listener for fade-in/out animation of banner
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 500);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Loading state
  if(isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessegeSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)} // Click anywhere to close preview
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-lg cursor-zoom-out
                       sm:max-w-md md:max-w-2xl lg:max-w-4xl transition-transform duration-300"
          />
        </div>
      )}

      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 relative">
        {/* Floating Sticky Day Banner */}
        <div
          className={`sticky top-0 z-10 w-fit mx-auto px-3 py-1 text-sm font-medium
            bg-gray-800 text-white rounded-sm shadow-md transition-opacity duration-500
            ${isScrolling ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {activeDate && <DateTimeFormatter value={activeDate} format="banner" />}
        </div>

        {/* 💬 Messages grouped by date */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} data-date-banner={date} className="space-y-4">
            
            <div className="text-center text-gray-500 text-sm my-2 font-semibold">
              <DateTimeFormatter value={date} format="banner" />
            </div>

            {msgs.map((message, index) => (
              <div
                key={message._id || index}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={index === msgs.length - 1 ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img 
                      src={message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <div className={`chat-bubble flex flex-col ${ 
                  message.senderId === authUser._id ? "items-start" : "items-end"
                  }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[250px] md:max-w-sm rounded-md mb-2 cursor-pointer transition-transform hover:scale-[1.02]" // 🟢 Added responsive widths + hover zoom
                      onClick={() => setPreviewImage(message.image)} // Open preview
                    />
                  )}
                  {message.text && <p className='text-sm'>{message.text}</p>}

                  <div className="chat-header mb-1 items-start self-end">
                    <time className="text-xs opacity-50 ml-1">
                      <DateTimeFormatter value={message.createdAt} format="timeOnly" />
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <MessageInput />
    </div>
  )
};

export default ChatContainer