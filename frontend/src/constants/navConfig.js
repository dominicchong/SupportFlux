import {
  Home,
  Bot,
  MessageCircleMore,
  BookOpen,
  CircleUser,
  Users,
  FolderKanban,
} from "lucide-react";
import { ROUTES } from "./paths";

export const NAV_ITEMS = [
  {
    label: "Home",
    icon: Home,
    to: ROUTES.HOME,
    visible: ({ authUser }) => !!authUser,
  },
  {
    label: "Chatbot",
    icon: Bot,
    to: ROUTES.CHATBOT,
    visible: ({ authUser }) => !!authUser,
  },
  {
    label: "Knowledge Base",
    icon: BookOpen,
    to: ROUTES.KNOWLEDGE_BASE,
    visible: ({ authUser }) => !!authUser,
  },
  {
    label: "Live Chat",
    icon: MessageCircleMore,
    to: ROUTES.LIVE_CHAT,
    visible: ({ authUser, isUserAuthorized }) => !!authUser && !isUserAuthorized(),
  },
  {
    label: "Chat",
    icon: FolderKanban,
    visible: ({ authUser, isUserAuthorized }) => !!authUser && isUserAuthorized(),
    children: [
      { label: "Dashboard", to: ROUTES.CHAT_DASHBOARD, visible: ({ authUser }) => authUser?.role === "admin", },
      { label: "Manage Chats", to: ROUTES.CHAT_MANAGER },
      { label: "Live Chat", to: ROUTES.LIVE_CHAT },
    ],
  },
  {
    label: "Accounts",
    icon: Users,
    to: ROUTES.ACCOUNTS,
    visible: ({ authUser }) => authUser?.role === "admin",
  },
  {
    label: authUser => authUser?.fullName?.split(" ")[0] || "Profile",
    icon: CircleUser,
    to: ROUTES.PROFILE,
    visible: ({ authUser }) => !!authUser,
  },
];
