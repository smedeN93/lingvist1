"use client";

import { useContext } from "react";
import { Loader2 } from "lucide-react";

import { GlobalChatContextProvider, GlobalChatContext, GlobalChatContextType } from "./global-chat-context";
import { GlobalChatInput } from "./GlobalChatInput";
import { GlobalMessages } from "./GlobalMessages";
import { Card, CardContent } from "@/components/ui/card";

const GlobalChatWrapperContent = () => {
  const { isLoading, messages } = useContext<GlobalChatContextType>(GlobalChatContext);

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <GlobalMessages />
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-16 mt-[-150px] mb-2 bg-[rgb(245,245,247)]">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-2" />
            <p className="text-sm font-light text-gray-600">Henter og analyserer relevante dokumenter...</p>
          </div>
        )}
      </div>
      <div>
        <GlobalChatInput />
      </div>
    </div>
  );
};

export const GlobalChatWrapper = () => {
  return (
    <GlobalChatContextProvider>
      {/* Wrap the chat content in Card and CardContent */}
      <Card className="shadow-md rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg mt-6">
        <CardContent className="p-6 bg-[rgb(245,245,247)]">
          <div className="relative flex flex-col overflow-hidden">
            <GlobalChatWrapperContent />
          </div>
        </CardContent>
      </Card>
    </GlobalChatContextProvider>
  );
};
