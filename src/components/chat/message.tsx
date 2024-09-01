import React, { forwardRef, ReactNode } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ExtendedMessage } from "@/types/message";
import { Icons } from "../icons";
import type { Components } from "react-markdown";

type MessageProps = {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    const renderMessageContent = () => {
      if (typeof message.text !== "string") return message.text;

      const [content, citationsRaw] = message.text.split('---CITATIONS---');
      const citations = citationsRaw
        ? citationsRaw.split('\n').filter(line => line.trim() !== '' && !line.includes('---END CITATIONS---'))
        : [];

      const customRenderers: Components = {
        p: ({ children }) => {
          const processedChildren = React.Children.map(children, child => {
            if (typeof child === 'string') {
              return child.split(/(\[[0-9]+\])/g).map((part, index) => {
                if (part.match(/^\[[0-9]+\]$/)) {
                  const citationIndex = parseInt(part.slice(1, -1)) - 1;
                  let citation = citations[citationIndex] || '';
                  // Remove "[1]: (Side: {side})" pattern from the citation
                  citation = citation.replace(/^\[\d+\]:\s*\(Side:\s*\d+\)\s*/, '').trim();
                  return (
                    <span key={index} className="relative group inline-flex items-center justify-center">
                      <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full cursor-pointer transition-all duration-200 ease-in-out group-hover:bg-blue-700">
                        {citationIndex + 1}
                      </span>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-gray-800 text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-200 w-64 text-left pointer-events-none shadow-lg border border-gray-200">
                        <strong>Side {citationIndex + 1}:</strong> {citation}
                      </span>
                    </span>
                  );
                }
                return part;
              });
            }
            return child;
          });
          return <p>{processedChildren}</p>;
        },
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-2">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">{children}</blockquote>,
      };

      return (
        <ReactMarkdown 
          className={cn("prose", { "text-zinc-50": message.isUserMessage })}
          components={customRenderers}
        >
          {content}
        </ReactMarkdown>
      );
    };
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
              "order-1 bg-zinc-800 rounded-sm": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            },
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-zinc-300 h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-balance max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {renderMessageContent()}

            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-blue-300": message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

Message.displayName = "Message";