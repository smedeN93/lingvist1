"use client";

import { useContext, useRef, useState } from "react";
import { motion } from "framer-motion";

import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";

import { GlobalChatContext } from "./global-chat-context";

interface GlobalChatInputProps {
  isDisabled?: boolean;
}

export const GlobalChatInput = ({ isDisabled }: GlobalChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isLoading,
    setIsLoading,
    addMessage,
    updateMessageById,
    setLoadingStatus,
  } = useContext(GlobalChatContext);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError(null); // Clear any previous errors when the user starts typing
  };

  const sendMessage = async (retryCount = 0) => {
    if (message.trim().length === 0 || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Starting...');

    const userMessageId = Date.now().toString();
    addMessage({ id: userMessageId, text: message, isUserMessage: true });

    const aiMessageId = (Date.now() + 1).toString();
    addMessage({ id: aiMessageId, text: "", isUserMessage: false, isLoading: true });

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
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunkValue = decoder.decode(value || new Uint8Array(), { stream: !done });
        buffer += chunkValue;

        let processedIndex = 0;

        // Process any status messages in the buffer
        while (true) {
          let statusStart = buffer.indexOf('status:', processedIndex);
          if (statusStart === -1) {
            break;
          }

          // Append any text before the status message to aiResponse
          if (statusStart > processedIndex) {
            const textPart = buffer.substring(processedIndex, statusStart);
            aiResponse += textPart;
            updateMessageById(aiMessageId, { text: aiResponse, isLoading: false });
          }

          // Find the end of the status line
          let statusEnd = buffer.indexOf('\n', statusStart);
          if (statusEnd === -1) {
            // Status line not complete yet, wait for more data
            break;
          }

          // Extract the status message
          const statusMessage = buffer.substring(statusStart + 7, statusEnd).trim();
          setLoadingStatus(statusMessage);

          // Move processedIndex past the status line
          processedIndex = statusEnd + 1;
        }

        // Append any remaining text to aiResponse
        if (processedIndex < buffer.length) {
          const textPart = buffer.substring(processedIndex);
          aiResponse += textPart;
          updateMessageById(aiMessageId, { text: aiResponse, isLoading: false });
        }

        // Reset buffer
        buffer = "";
      }

      // Clear loading status after processing
      setLoadingStatus(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      updateMessageById(aiMessageId, { isLoading: false, error: "Failed to load message" });
      
      // Implement retry mechanism
      if (retryCount < 3) {
        setTimeout(() => sendMessage(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        setError("Failed to send message after multiple attempts. Please try again later.");
        setLoadingStatus(null);
      }
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="p-2 mt-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        autoCapitalize="off"
        autoComplete="off"
        className="mx-2 flex flex-col items-center gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        {error && (
          <div className="text-red-500 text-sm mb-2 w-full text-center">
            {error}
          </div>
        )}
        <div className="relative flex flex-1 items-center w-full">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-[rgb(250,250,252)] backdrop-blur-md rounded-full z-0" />
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
                    sendMessage();
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
                    sendMessage();
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
