"use client";

import { useContext, useEffect, useRef } from "react";
import { Loader2} from "lucide-react";

import { GlobalChatContext } from "./global-chat-context";

export const GlobalMessages = () => {
  const { messages, isLoading } = useContext(GlobalChatContext);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-3 overflow-y-auto">
      {messages && messages.length > 0 ? (
        messages.map((message, i) => {
          const isLastMessage = i === messages.length - 1;

          return (
            <div
              key={message.id}
              ref={isLastMessage ? lastMessageRef : null}
              className={`flex ${
                message.isUserMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-sm ${
                  message.isUserMessage
                    ? "bg-[#519DE9] text-white"
                    : "bg-[rgb(250,250,252)] text-gray-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading messages...</p>
        </div>
      ) : null}
    </div>
  );
};
