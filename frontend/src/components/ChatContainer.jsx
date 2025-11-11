import { useEffect, useState, useRef } from 'react';
import {useChatStore} from "../store/useChatStore";
import { useAuthStore } from '../store/useAuthStore';

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { DateTimeFormatter, ScrollToBottom } from "./BasicUIComponents";
import { PreviewImage } from './PreviewImage';

const ChatContainer = () => {
  const {messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages, 
    unsubscribeFromMessages, getGroupedMessages, activeDate, setActiveDate, resetActiveDate, 
    getFirstUnreadIndex, hasUnread} = useChatStore();
    
  const {authUser, isYou} = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messageEndRef = useRef(null);
  const scrollRef = useRef(null);
  const unreadRef = useRef(null);
  const scrollTimeout = useRef(null);
  const groupedMessages = getGroupedMessages();
  const unreadIndex = getFirstUnreadIndex();
  const hasUnreadMsg = hasUnread();

  console.log("unreadIndex:", unreadIndex);
  console.log("hasUnread:", hasUnread());

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if(!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    resetActiveDate();  //Resets date banner when navigated to different chat

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, resetActiveDate]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !messages?.length) return;
    
    // Scroll to first unread message on load
    if (hasUnreadMsg && unreadIndex !== -1) {
      const unreadMessage = container.querySelector(
        `[data-message-index="${unreadIndex}"]`
      );
      if (unreadMessage) {
        const offset = 30; // adjust to control how much content above is shown
        container.scrollTo({
          top: unreadMessage.offsetTop - offset,
          behavior: "smooth",
        });
      }
    }

    scrollToBottom();
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
  }, [groupedMessages, activeDate, setActiveDate]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      setShowScrollButton(!isAtBottom);

      // For smooth banner fade-in/out animation
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
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      {previewImage && (
        <PreviewImage previewImage={previewImage} setPreviewImage={setPreviewImage} />
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

        {/* {hasUnreadMsg && (
          <div className="text-center text-xs text-gray-500 bg-gray-100 my-1 p-2">
            ── Unread Messages ──
          </div>
        )} */}

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
                  isYou(message.senderId) ? "chat-end" : "chat-start"
                }`}
                ref={index === msgs.length - 1 ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img 
                      src={isYou(message.senderId)
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <div className={`chat-bubble flex flex-col ${ 
                  isYou(message.senderId) ? "items-start bg-purple-200" : "items-end"
                  }`}>
                  <span>{}</span>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-[250px] md:max-w-xs rounded-md mb-2 cursor-pointer transition-transform hover:scale-[1.02]" // 🟢 Added responsive widths + hover zoom
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
      
      <ScrollToBottom visible={showScrollButton} onClick={scrollToBottom} />
      <MessageInput />
    </div>
  )
};

export default ChatContainer