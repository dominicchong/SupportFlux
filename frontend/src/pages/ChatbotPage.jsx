import { useState, useRef, useEffect } from "react";
import { IoHelpCircleOutline, IoSend, IoArrowDown } from "react-icons/io5";
import { HiClipboardList, HiCollection } from "react-icons/hi";
import { TbMessageChatbot } from "react-icons/tb";
import { useChatbotStore } from "../store/useChatbotStore";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

const FEATURES = [
  { text: "What is SupportFlux?", icon: IoHelpCircleOutline },
  { text: "What is the Live Chat function for?", icon: HiCollection },
  { text: "How to find information related to studies?", icon: HiClipboardList },
  { text: "I want to talk to a staff/live agent", icon: TbMessageChatbot },
];

const ChatbotPage = () => {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { messages, sendPrompt, resetChat, isLoading } = useChatbotStore();
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isResponseScreen = messages.length > 0;

  // Detect scroll position
  useEffect(() => {
    const container = chatbotRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    requestAnimationFrame(() => handleScroll());  // Only show scroll button after DOM renders

    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if(messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behaviour: "smooth"});
    }
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
    setTimeout(() => scrollToBottom(), 200);
  };

  return (
    <div className="pt-16 h-screen bg-[#FFFFFF] text-black flex flex-col">
      {/* Desktop sticky header */}
      {isResponseScreen && (
        <header className="sticky top-16 z-1 bg-white px-4 py-2 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72 flex justify-between items-center ">
          <h2 className="text-2xl font-medium">Chatbot</h2>
          <button
            onClick={resetChat}
            className="bg-blue-100 text-cyan-700 rounded-xl px-4 sm:px-5 py-2 text-sm
                        border border-cyan-200 hover:bg-cyan-50 transition shadow-sm"
          >
            Clear Chat
          </button>
        </header>
      )}

      {/* Main */}
      <main
        ref={chatbotRef}
        className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72 pt-8 mb-12"
      >
        {isResponseScreen ? (
          /* Chat view */
          <div className="flex flex-col gap-2 sm:gap-4 pb-15">
            {messages && messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.type === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`
                    relative px-4 py-3 rounded-2xl shadow-sm break-words
                    max-w-[80%] sm:max-w-[75%] text-sm leading-relaxed
                    ${m.type === "bot"
                      ? "bg-white border border-gray-200 text-gray-900"
                      : "bg-purple-500 text-white ml-auto"}
                  `}
                >
                  {/* Bubble Arrow */}
                  {m.type === "bot" && (
                    <div className="absolute -left-2.5 top-3 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-gray-100" />
                  )}
                  {m.type === "user" && (
                    <div
                      className="
                        absolute right-[-8px] top-3
                        w-0 h-0
                        border-y-[7px] border-y-transparent
                        border-l-[10px] border-l-purple-500"
                    />
                  )}

                  {/* Text */}
                  {m.type === "bot" ? (
                    <ReactMarkdown
                      rehypePlugins={[rehypeSanitize]}
                      components={{
                        p: ({ node, ...props }) => <p className="text-gray-900 text-sm leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                        code: ({ node, ...props }) => (
                          <code className="bg-gray-100 text-purple-700 px-1 py-0.5 rounded" {...props} />
                        ),
                        a: ({ node, ...props }) => <a className="text-blue-600 underline" target="_blank" rel="noreferrer" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4 list-disc" {...props} />,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
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
            <div ref={messagesEndRef}/>
          </div>
        ) : (
          /* Quick‑ask cards */
          <div className="py-20 flex flex-col items-center justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-8">What can I help with you today?</h1>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 px-4">
              {FEATURES.map(({ text, icon: Icon }, i) => (
                <div
                  key={i}
                  className="relative bg-white border border-gray-200 p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => handleSend(text)}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{text}</p>
                  <Icon className="absolute bottom-3 right-3 text-xl" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 left-1/2 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <IoArrowDown className="text-xl" />
        </button>
      )} 

      {/* Fixed Input bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] flex flex-col items-center pb-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 2xl:px-72">
        <div className="w-full flex items-center bg-white rounded-2xl py-3 px-4 shadow-md border border-gray-200 focus-within:border-purple-400 transition">
          <textarea
            placeholder="Write your message here..."
            className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed
                        min-h-[1.5rem] max-h-[5rem] overflow-y-auto placeholder-gray-400"
            value={input}
            ref={inputRef}
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
            className={`text-xl ml-2 ${input.trim() && !isLoading
              ? "text-purple-500 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
              }`}
            onClick={() => {
              if (input.trim() && !isLoading) handleSend();
            }}
          />
        </div>
        <p className="text-gray-400 text-center text-xs mt-4 px-4">
          This chatbot uses Gemini API and may make mistakes.
        </p>
      </footer>
    </div>
  );
};

export default ChatbotPage;
