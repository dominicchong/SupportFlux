import { useState, useRef, useEffect } from "react";
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { HiClipboardList, HiCollection } from "react-icons/hi";
import { TbMessageChatbot } from "react-icons/tb";
import { useChatbotStore } from "../store/useChatbotStore";
import { IoArrowDown } from "react-icons/io5";
import ReactMarkdown from "react-markdown";

const FEATURES = [
  { text: "How to learn Java effectively?", icon: IoCodeSlash },
  { text: "How do I resolve the timetable clashes in Universiti Malaya?", icon: HiCollection },
  { text: "How to register for courses in Universiti Malaya?", icon: HiClipboardList },
  { text: "How can we use AI for adoption?", icon: TbMessageChatbot },
];

const ChatbotPage = () => {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { messages, sendPrompt, newChat, isLoading } = useChatbotStore();
  const chatContainerRef = useRef(null);

  const isResponseScreen = messages.length > 0;

  // Detect scroll position
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      setShowScrollButton(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Only scroll when user 'sends a message'
  const handleSend = (customInput) => {
    const inputPrompt = customInput || input;
    if (!inputPrompt.trim()) return alert("You must write something!");
    sendPrompt(inputPrompt.trim());
    setInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "1.5rem"; // ~1 line height
    }

    // After sending, scroll to bottom
    setTimeout(() => scrollToBottom(), 100);
  };

  return (
    <div className="pt-16 min-h-screen bg-[#FFFFFF] text-black flex flex-col">
      {/* Header */}
      {isResponseScreen && (
        <header className="px-4 py-2 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72 flex justify-between items-center ">
          <h2 className="text-2xl">Chatbot</h2>
          <button
            onClick={newChat}
            className="bg-[#97dbff] rounded-full px-4 sm:px-5 py-2 text-sm hover:bg-[#cbedff] hover:cursor-pointer transition"
          >
            New Chat
          </button>
        </header>
      )}

      {/* Main */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72 pt-8"
        style={{ maxHeight: "calc(100vh - 160px)", paddingBottom: "100px" }}
      >
        {isResponseScreen ? (
          /* Chat view */
          <div className="flex flex-col space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    relative px-4 py-2 rounded-xl break-words
                    max-w-[80%]
                    ${m.type === "bot" ? "bg-purple-100 text-purple-800 text-left" : "bg-[#e0e0e0] text-black text-right"}
                  `}
                >
                  {/* Arrows */}
                  {m.type === "bot" && (
                    <div className="absolute -left-2 bottom-5 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-purple-100" />
                  )}
                  {m.type === "user" && (
                    <div className="absolute -right-2 bottom-3 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-[#e0e0e0]" />
                  )}

                  {/* Text */}
                  {m.type === "bot" ? (
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="self-start bg-[#e0e0e0] p-4 rounded-[30px] max-w-[60vw] min-w-[20vw] animate-pulse text-gray-400">
                Thinking...
              </div>
            )}
          </div>
        ) : (
          /* Quick‑ask cards */
          <div className="pt-20 flex flex-col items-center justify-center">
            <h1 className="text-4xl mb-8">What can I help with you today?</h1>
            <div className="flex gap-4 justify-center px-4">
              {FEATURES.map(({ text, icon: Icon }, i) => (
                <div
                  key={i}
                  className="relative w-64 min-h-[160px] bg-[#e0e0e0] p-6 rounded-lg cursor-pointer transition hover:bg-[#b4b4b4]"
                  onClick={() => handleSend(text) }
                >
                  <p className="text-base leading-relaxed">{text}</p>
                  <Icon className="absolute bottom-3 right-3 text-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-8 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition"
          >
            <IoArrowDown className="text-xl" />
          </button>
        )}

        {/* Fixed Input bar */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] flex flex-col items-center pb-6 pt-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72">
          <div className="w-full flex items-center bg-[#e0e0e0] rounded-2xl py-2 px-4">
            <textarea
              placeholder="Write your message here..."
              className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed
                        min-h-[1.5rem] max-h-[4.5rem] overflow-y-auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto"; // reset height
                e.target.style.height = `${Math.min(e.target.scrollHeight, 72)}px`; 
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              disabled={isLoading}
            />

            <IoSend
              className={`text-xl ml-2 ${
                input.trim() && !isLoading
                  ? "text-purple-500 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => {
                if (input.trim() && !isLoading) handleSend();
              }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-4">
            This chatbot uses Gemini API and may make mistakes.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ChatbotPage;
