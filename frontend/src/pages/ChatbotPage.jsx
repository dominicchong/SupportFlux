import { useState, useRef, useEffect } from "react";
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { BiPlanet } from "react-icons/bi";
import { FaPython } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { useChatbotStore } from "../store/useChatbotStore";
import ReactMarkdown from "react-markdown";

const FEATURES = [
  { text: "What is coding? How can we learn it?", icon: IoCodeSlash },
  { text: "Which is the red planet of the solar system?", icon: BiPlanet },
  { text: "In which year was Python invented?", icon: FaPython },
  { text: "How can we use AI for adoption?", icon: TbMessageChatbot },
];

const ChatbotPage = () => {
  const [input, setInput] = useState("");
  const { messages, sendPrompt, newChat, isLoading } = useChatbotStore();
  const chatContainerRef = useRef(null);

  const isResponseScreen = messages.length > 0;

  // Auto scroll to bottom on messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (customInput) => {
    const inputPrompt = customInput || input;
    if (!inputPrompt.trim()) return alert("You must write something!");
    sendPrompt(inputPrompt.trim());
    setInput("");
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FFFFFF] text-black flex flex-col">
      {/* Header */}
      {isResponseScreen && (
        <header className="px-[300px] flex justify-between items-center">
          <h2 className="text-2xl">Chatbot</h2>
          <button
            onClick={newChat}
            className="bg-[#e0e0e0] rounded-full px-5 py-2 text-sm hover:bg-[#b4b4b4] transition"
          >
            New Chat
          </button>
        </header>
      )}

      {/* Main */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-[300px] pt-8"
        style={{ maxHeight: "calc(100vh - 160px)", paddingBottom: "100px" }}
      >
        {isResponseScreen ? (
          /* Chat view */
          <div className="flex flex-col space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`relative p-4 rounded-[30px] max-w-[50vw] min-w-[20vw] break-words self-${
                  m.type === "user" ? "end" : "start"
                } ${m.type === "bot" ? "bg-purple-100 text-purple-800" : "bg-[#e0e0e0] text-black"}`}
              >
                {/* Arrow - Bot Message (Left) */}
                {m.type === "bot" && (
                  <div className="absolute -left-2 bottom-5 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-purple-100" />
                )}

                {/* Arrow - User Message (Right) */}
                {m.type === "user" && (
                  <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-[#e0e0e0]" />
                )}

                {/* Message Text */}
                {m.type === "bot" ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
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
      </main>

      {/* Fixed Input bar */}
      <footer className="fixed bottom-0 left-[300px] right-[300px] bg-[#FFFFFF] flex flex-col items-center pb-6 pt-4">
        <div className="w-full flex items-center bg-[#e0e0e0] rounded-full py-2 px-4">
          <textarea
            placeholder="Write your message here..."
            className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed max-h-[7.5rem] min-h-[1.5rem] overflow-y-auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto"; // Reset height
              e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
            }}

            // Submit question on Enter key
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent newline on Enter
                handleSend();
              }
            }}
            rows={1}
            disabled={isLoading}
          />

          {input && !isLoading && (
            <IoSend
              className="text-purple-500 text-xl cursor-pointer"
              onClick={handleSend}
            />
          )}
        </div>
        <p className="text-gray-400 text-xs mt-4">
          This chatbot uses Gemini API via a secure backend.
        </p>
      </footer>
    </div>
  );
};

export default ChatbotPage;
