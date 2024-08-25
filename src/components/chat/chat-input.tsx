"use client";

import { useContext, useRef } from "react";
import { motion } from "framer-motion";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ChatContext } from "./chat-context";
import ToolbarExpandable from "../ui/ChatToolBar";

type ChatInputProps = {
  isDisabled?: boolean;
};

export const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form
        onSubmit={(e) => e.preventDefault()}
        autoCapitalize="off"
        autoComplete="off"
        className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 items-end flex-row">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative flex items-center">
              <Textarea
                ref={textareaRef}
                placeholder="Indtast dit spørgsmål..."
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
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-grow"
              />

              <button
                disabled={isLoading || isDisabled || !message.trim()}
                aria-disabled={isLoading || isDisabled || !message.trim()}
                type="submit"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
                className={cn(
                  "absolute right-2 top-1/2 z-50 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 lg:h-10 lg:w-10 rounded-full",
                  "bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200",
                  "flex items-center justify-center",
                  "disabled:bg-gray-100 disabled:cursor-not-allowed"
                )}
                aria-label="Send Message..."
                title="Send Besked..."
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300 h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-5 lg:w-5"
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
          
          <div className="flex mb-4 mr-4">
            <ToolbarExpandable />
          </div>
        </div>
      </form>
    </div>
  );
};