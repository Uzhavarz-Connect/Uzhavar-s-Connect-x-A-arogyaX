"use client";
import Sidebar from "@/components/sidebar";
import {
  Bot,
  Cross,
  FileScan,
  Gamepad2,
  Home,
  Hospital,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { Form } from "react-router-dom";

const userLinks = [
  {
    icon: <Home />,
    text: "Home",
    href: "/patient",
  },
  {
    icon: <UserRound />,
    text: "My Profile",
    href: "/patient/profile",
  },
  {
    icon: <MessageCircle />,
    text: "Chats",
    href: "/patient/chats",
  },
  {
    icon: <Hospital />,
    text: "Hospitals Near Me",
    href: "/patient/hospitals-nearme",
  },
  {
    icon: <Bot />,
    text: "Medical Chatbot",
    href: "/patient/med-chatbot",
  },
  {
    icon: <Gamepad2 />,
    text: "Glucose Guardian",
    href: "https://glucose-gladiators-game.lovable.app/",
  },
  {
    icon: <Cross />,
    text: "Ambulance Rerouting",
    href: "http://localhost:8501",
  },
  {
    icon: <FileScan />,
    text: "Prescription",
    href: "https://med-transit-guardian-3d-40.lovable.app/health",
  },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-stretch min-h-screen max-h-screen font-[family-name:var(--font-poppins)] backdrop-blur-[4px] bg-white/70">
      <Sidebar links={userLinks} />
      {children}
    </div>
  );
}
