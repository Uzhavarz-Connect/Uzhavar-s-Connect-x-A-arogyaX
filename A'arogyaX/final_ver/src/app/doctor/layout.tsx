"use client";
import Sidebar from "@/components/sidebar";
import {
  BrainCircuit,
  Cross,
  Home,
  Hospital,
  MessageCircleMore,
  Search,
  SquareKanban,
  User,
  Users,
} from "lucide-react";

const dashboardLinks = [
  {
    icon: <Home />,
    text: "Home",
    href: "/doctor",
  },
  {
    icon: <Hospital />,
    text: "Hospital near me",
    href: "/doctor/hospitals-nearme",
  },
  {
    icon: <BrainCircuit />,
    text: "Digital twin",
    href: "https://preview--med-transit-guardian-3d-87.lovable.app/digital-twin",
  },
  {
    icon: <MessageCircleMore />,
    text: "Chat with Patients",
    href: "/doctor/chats",
  },
  {
    icon: <Users />,
    text: "Forum",
    href: "/doctor/forum",
  },
  {
    icon: <Cross />,
    text: "MedBot AI",
    href: "/doctor/med-chatbot",
  },
];

export default function HDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-stretch min-h-screen max-h-screen font-[family-name:var(--font-poppins)] backdrop-blur-sm bg-white/60">
      <Sidebar links={dashboardLinks} />
      {children}
    </div>
  );
}
