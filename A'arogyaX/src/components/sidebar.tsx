"use client";
import useAuthContext from "@/hooks/useAuthContext";
import SidebarLink, { SidebarLinkProps } from "./sidebar-link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export type SidebarProps = {
  links?: SidebarLinkProps[];
};

export default function Sidebar({ links }: SidebarProps) {
  const auth = useAuthContext();
  const router = useRouter();
  return (
    <div className="rounded-r-4xl flex flex-col items-stretch">
      <div className="py-8 self-center">
        <p className="text-3xl font-bold">
          AY<span className="text-blue-800 text-center text-4xl">X</span>
        </p>
      </div>
      <div className="py-4 px-4 flex-grow flex flex-col items-center justify-center">
        <div className="text-xl flex flex-col gap-2 py-2 relative">
          {links?.map((link, index) => (
            <SidebarLink
              key={index}
              icon={link.icon}
              text={link.text}
              href={link.href}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end py-5 px-6">
        <button
          className="bg-blue-200 text-blue-900 font-semibold rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
          onClick={() => {
            auth.logout!();
            router.push("/");
          }}
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
}
