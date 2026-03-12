"use client";

import { usePathname } from "next/navigation";
import { ChatBubble } from "./ChatBubble";

export function DevChatbot() {
  const pathname = usePathname();

  if (pathname === "/password") return null;

  return <ChatBubble />;
}
