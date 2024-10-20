"use client";

import { useEffect, useContext } from "react";
import { GlobalChatContextProvider, GlobalChatContext } from "./global-chat-context";
import { GlobalChatInput } from "./GlobalChatInput";
import { GlobalMessages } from "./GlobalMessages";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/app/_trpc/client";

const GlobalChatWrapperContent = () => {
  const { data: files } = trpc.getUserFiles.useQuery();
  const { setFileCount } = useContext(GlobalChatContext);

  useEffect(() => {
    if (files) {
      setFileCount(files.length);
    }
  }, [files, setFileCount]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <GlobalMessages />
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
