"use client";

import { useContext, useRef, useState } from "react";
import { motion } from "framer-motion";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { GlobalChatContext } from "./global-chat-context";

interface GlobalChatInputProps {
  isDisabled?: boolean;
}

export const GlobalChatInput = ({ isDisabled }: GlobalChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    setMessages,
    isLoading,
    setIsLoading,
    messages, // Include messages from context if needed
  } = useContext(GlobalChatContext);

  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = async () => {
    if (message.trim().length === 0 || isLoading) return;

    setIsLoading(true);
    const userMessageId = Date.now().toString();
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: userMessageId, text: message, isUserMessage: true },
    ]);

    try {
      const response = await fetch("/api/global-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      const aiMessageId = (Date.now() + 1).toString(); // Ensure unique ID

      // Optimistically add the AI message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: aiMessageId, text: "", isUserMessage: false },
      ]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Update the last message (AI's message) incrementally
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const aiMessageIndex = updatedMessages.findIndex(
            (msg) => msg.id === aiMessageId
          );
          if (aiMessageIndex !== -1) {
            updatedMessages[aiMessageIndex] = {
              ...updatedMessages[aiMessageIndex],
              text: aiResponse,
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally handle the error here
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="p-2 mt-4"> {/* Added mt-4 for top margin */}
      <form
        onSubmit={(e) => e.preventDefault()}
        autoCapitalize="off"
        autoComplete="off"
        className="mx-2 flex flex-row items-center gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full">
            {/* Background overlay with frosted effect */}
            <div className="absolute inset-0 bg-[rgb(250,250,252)] backdrop-blur-md rounded-full z-0" />
            {/* Input field and send button */}
            <div className="relative flex items-center">
              <Textarea
                ref={textareaRef}
                placeholder="Ask AI a question or make a request..."
                rows={1}
                maxRows={4}
                autoFocus
                disabled={isLoading || isDisabled}
                aria-disabled={isLoading || isDisabled}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                className="relative min-h-[52px] max-h-[200px] w-full resize-none pr-24 py-3 text-base bg-transparent rounded-full z-10"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 z-20">
                <button
                  disabled={isLoading || isDisabled || !message.trim()}
                  aria-disabled={isLoading || isDisabled || !message.trim()}
                  type="submit"
                  onClick={() => {
                    addMessage();
                    textareaRef.current?.focus();
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    "bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200",
                    "flex items-center justify-center",
                    "disabled:bg-white disabled:cursor-not-allowed"
                  )}
                  aria-label="Send Message..."
                  title="Send Message..."
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 h-5 w-5"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <motion.path
                      d="M5 12l14 0"
                      initial={{
                        strokeDasharray: "50%",
                        strokeDashoffset: "50%",
                      }}
                      animate={{
                        strokeDashoffset: message.trim() ? 0 : "50%",
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "linear",
                      }}
                    />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                  </motion.svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
