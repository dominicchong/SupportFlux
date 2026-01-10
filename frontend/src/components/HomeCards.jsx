import { Link } from "react-router-dom";
import { Bot, MessageCircleMore, BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "../components/BasicUIComponents";
import { ROUTES } from "../constants/paths";

const FEATURES = [
  {
    title: "Chatbot Assistant",
    description: "Have a question? Our smart assistant is ready to help you find exactly what you need in seconds.",
    time: "Instant",
    icon: <Bot className="size-8" />,
    link: ROUTES.CHATBOT,
    gradient: "from-cyan-50 to-cyan-100 border-cyan-200",
    tag: "AI Powered"
  },
  {
    title: "Knowledge Base",
    description: "Know what to find? Browse the source articles, information, and FAQs directly.",
    time: "Self-Guided",
    icon: <BookOpen className="size-8" />,
    link: ROUTES.KNOWLEDGE_BASE,
    gradient: "from-blue-50 to-blue-100 border-blue-200",
    tag: "Source Data"
  },
  {
    title: "Chat with Staff",
    description: "If the chatbot and articles couldn't solve your specific issue, connect with our faculty staff.",
    time: "Human Expert",
    icon: <MessageCircleMore className="size-8" />,
    link: ROUTES.LIVE_CHAT,
    gradient: "from-purple-50 to-purple-100 border-purple-200",
    tag: "Escalation"
  },
];

const HomeCards = () => {
  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {FEATURES.map((feature, index) => (
          <Link to={feature.link} key={index} className="relative group">
            <Card className={`border-2 transition-all duration-300 hover:shadow-xl bg-gradient-to-b ${feature.gradient}`}>
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                {/* Tag */}
                <span className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm">
                  {feature.tag}
                </span>

                <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                <h2 className="text-xl font-bold">{feature.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="pt-4 border-t border-black/5 w-full">
                  <span className="text-xs font-semibold flex items-center justify-center gap-1 text-gray-500">
                    <Clock className="size-3" /> {feature.time}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCards;
