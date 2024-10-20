"use client";

import React, { useContext, useRef, useState } from "react";
import { motion } from "framer-motion";

import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";

import { GlobalChatContext, LoadingStep } from "./global-chat-context";
import { SuggestionCards } from "./SuggestionCards";

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
    setLoadingSteps,
    fileCount,
  } = useContext(GlobalChatContext);

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const sendMessage = async () => {
    if (message.trim().length === 0 || isLoading) return;

    setIsLoading(true);
    setError(null);

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

      // Initialize loading steps
      const initialSteps: LoadingStep[] = [
        { label: 'Gennemgår alle dine filer...', status: 'active' },
        { label: 'Finder relevante afsnit...', status: 'pending' },
        { label: 'Sammensætter svar...', status: 'pending' },
      ];
      setLoadingSteps(initialSteps);

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

          // Find the end of the status line
          let statusEnd = buffer.indexOf('\n', statusStart);
          if (statusEnd === -1) {
            // Status line not complete yet, wait for more data
            break;
          }

          // Extract the status message
          const statusMessage = buffer.substring(statusStart + 7, statusEnd).trim();

          // Update loading steps based on the received status
          setLoadingSteps((prevSteps) => {
            return prevSteps.map((step, index) => {
              if (step.label === statusMessage) {
                // Mark the previous step as completed
                if (index > 0) {
                  prevSteps[index - 1].status = 'completed';
                }
                return { ...step, status: 'active' };
              }
              return step;
            });
          });

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

      // Mark all steps as completed after processing
      setLoadingSteps((prevSteps) =>
        prevSteps.map((step) => ({ ...step, status: 'completed' }))
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Din besked er for lang. Den må maksimalt være 300 tegn.");
      updateMessageById(aiMessageId, { isLoading: false, error: "Kunne ikke indlæse beskeden" });
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
        <div className="relative flex flex-1 items-center w-full -mt-4">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-white backdrop-blur-md rounded-full z-0" />
            <div className="relative flex items-center font-light">
              <Textarea
                ref={textareaRef}
                placeholder={fileCount === 0 ? "Upload et par dokumenter og stil et spørgsmål" : "Stil et spørgsmål på tværs af alle dine dokumenter"}
                rows={1}
                maxRows={4}
                autoFocus
                disabled={isLoading || isDisabled || fileCount === 0}
                aria-disabled={isLoading || isDisabled || fileCount === 0}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && fileCount > 0) {
                    e.preventDefault();
                    sendMessage();
                    textareaRef.current?.focus();
                  }
                }}
                className="relative min-h-[52px] max-h-[200px] w-full resize-none pr-24 py-3 text-base bg-transparent rounded-full z-10"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 z-20">
                <button
                  disabled={isLoading || isDisabled || !message.trim() || fileCount === 0}
                  aria-disabled={isLoading || isDisabled || !message.trim() || fileCount === 0}
                  type="submit"
                  onClick={() => {
                    if (fileCount > 0) {
                      sendMessage();
                      textareaRef.current?.focus();
                    }
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    "bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200",
                    "flex items-center justify-center",
                    "disabled:bg-[rgb(245,245,247)] disabled:cursor-not-allowed"
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
      <SuggestionCards onSuggestionClick={handleSuggestionClick} />
    </div>
  );
};
