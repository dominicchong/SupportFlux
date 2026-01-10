import { PlusCircle, MessageSquare, ShieldCheck, MessageCircleMore } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 md:p-16 bg-[#F8FAFC] h-full">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Live Chat</h2>
          <p className="text-base-content/60 text-lg">
            Connect directly with faculty staff for personalized assistance.
          </p>
        </div>

        {/* Instruction Grid*/}
        <div className="grid grid-cols-1 gap-4 text-left">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm transition-hover hover:border-primary/30">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <PlusCircle className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Create a New Inquiry</h4>
              <p className="text-xs text-base-content/60">Click the "New Chat" button in the sidebar to start a fresh conversation with our staff.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm transition-hover hover:border-secondary/30">
            <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Select Active Chats</h4>
              <p className="text-xs text-base-content/60">Browse your existing tickets on the left. Search by category or level to find specific discussions.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm transition-hover hover:border-accent/30">
            <div className="bg-accent/10 p-2 rounded-lg text-accent">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Verified Faculty Support</h4>
              <p className="text-xs text-base-content/60">All chats are monitored by authorized staff to ensure you get accurate academic guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;