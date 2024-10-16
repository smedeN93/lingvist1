"use client";

import React, { useContext, useEffect, useRef, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { GlobalChatContext } from "./global-chat-context";
import { Components } from 'react-markdown';

interface MessageProps {
  message: {
    id: string;
    text: string;
    isUserMessage: boolean;
    isLoading?: boolean;
    error?: string;
  };
  onRetry: (id: string) => void;
}

const Message: React.FC<MessageProps> = React.memo(({ message, onRetry }) => {
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

  if (message.isUserMessage) {
    return <div className="text-white">{message.text}</div>;
  }

  if (message.isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>AI is thinking...</span>
      </div>
    );
  }

  if (message.error) {
    return (
      <div className="text-red-500">
        Error: {message.error}
        <button
          className="ml-2 text-blue-500 underline"
          onClick={() => onRetry(message.id)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <ReactMarkdown components={customRenderers}>{message.text}</ReactMarkdown>
    </div>
  );
});

Message.displayName = 'Message';

export const GlobalMessages = () => {
  const { messages, isLoading, loadingStatus, updateMessageById } = useContext(GlobalChatContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > prevMessageCount) {
      scrollToBottom();
    }
    setPrevMessageCount(messages.length);
  }, [messages, scrollToBottom, prevMessageCount]);

  const handleRetry = useCallback((id: string) => {
    // Implement retry logic here
    console.log("Retrying message:", id);
    updateMessageById(id, { isLoading: true, error: undefined });
    // You would typically re-fetch the message content here
    // For now, we'll just simulate a successful retry after a delay
    setTimeout(() => {
      updateMessageById(id, { isLoading: false, text: "Retried message content" });
    }, 2000);
  }, [updateMessageById]);

  return (
    <div className="flex flex-col gap-4 p-3 overflow-y-auto">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
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
              <Message message={message} onRetry={handleRetry} />
            </div>
          </div>
        ))
      ) : isLoading ? (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading messages...</p>
        </div>
      ) : null}
      <div ref={messagesEndRef} />
      {loadingStatus && (
        <div className="text-gray-500 text-center mt-2">
          {loadingStatus}
        </div>
      )}
    </div>
  );
};
