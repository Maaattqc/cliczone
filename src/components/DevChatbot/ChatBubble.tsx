"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#3b5bdb] text-white shadow-lg shadow-[#3b5bdb]/25 transition-all hover:scale-105 hover:bg-[#364fc7] hover:shadow-xl hover:shadow-[#3b5bdb]/30 active:scale-95"
          aria-label="Ouvrir le chatbot"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}
