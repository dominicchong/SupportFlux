import { Link } from "react-router-dom";
import { Bot, MessageCircleMore, BookOpen } from "lucide-react";
import { Card, CardContent } from "../components/BasicUIComponents";

export const FEATURES = [
  {
    title: "Chatbot Assistant",
    description: "Instant answers from our smart support bot.",
    icon: <Bot className="size-8 text-primary" />,
    link: "/chatbot",
    gradient: "from-cyan-100 to-cyan-300",
  },
  {
    title: "Live Chat with Staff",
    description: "Chat with faculty staff in real-time.",
    icon: <MessageCircleMore className="size-8 text-primary" />,
    link: "/live-chat",
    gradient: "from-gray-100 to-gray-300",
  },
  {
    title: "Knowledge Base",
    description: "Browse articles and FAQs about course of study.",
    icon: <BookOpen className="size-8 text-primary" />,
    link: "/knowledgebase",
    gradient: "from-blue-100 to-blue-300",
  },
];

const HomeCards = () => {
  return (
    <div>
      {/* FEATURES Cards */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((FEATURES, index) => (
            <Link to={FEATURES.link} key={index} className="block">
              <Card className={`hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 h-full bg-gradient-to-r ${FEATURES.gradient}`}>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/20 p-4 rounded-full text-primary">
                    {FEATURES.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{FEATURES.title}</h2>
                  <p className="text-sm text-muted-foreground">{FEATURES.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeCards;
