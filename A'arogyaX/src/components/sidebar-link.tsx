"use client";
import Link from "next/link";
import { JSX } from "react";

export type SidebarLinkProps = {
  href: string;
  icon: JSX.Element;
  text: string;
};

export default function SidebarLink({
  href,
  icon,
  text,
}: Readonly<SidebarLinkProps>) {
  return (
    <Link
      className="transition-all rounded-full w-14 h-14 border-transparent bg-zinc-100/40 border hover:border-zinc-400 flex items-center justify-center relative group"
      href={href}
    >
      {icon}
      <p className="group-hover:w-fit group-hover:px-4 w-0 px-0 overflow-hidden transition-all absolute inset-0 h-fit my-auto whitespace-nowrap left-16 bg-zinc-100/30 text-sm font-semibold py-1 rounded-lg">
        {text}
      </p>
    </Link>
  );
}
