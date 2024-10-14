"use client";

import React, { useContext, useEffect, useRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { GlobalChatContext } from "./global-chat-context";
import { Components } from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
}

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

  const customRenderers: Components = {
    p: ({ children }) => <p className="mb-2">{children}</p>,
    h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">{children}</blockquote>,
  };

  const renderMessage = (message: Message) => {
    if (message.isUserMessage) {
      return <div className="text-white">{message.text}</div>;
    }

    return (
      <div className="text-gray-900">
        <ReactMarkdown components={customRenderers}>{message.text}</ReactMarkdown>
      </div>
    );
  };

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
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.isUserMessage
                    ? "bg-[#519DE9] text-white"
                    : "bg-[rgb(250,250,252)] text-gray-900"
                }`}
              >
                {renderMessage(message)}
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
