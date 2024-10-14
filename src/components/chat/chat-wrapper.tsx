"use client";

import type { UploadStatus } from "@prisma/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";

import { trpc } from "@/app/_trpc/client";
import { buttonVariants } from "@/components/ui/button";

import { ChatContextProvider, ChatContext } from "./chat-context";
import { ChatInput } from "./chat-input";
import { Messages } from "./messages";

type ChatWrapperProps = {
  fileId: string;
};

const ChatWrapperContent = ({ fileId }: ChatWrapperProps) => {
  const [status, setStatus] = useState<UploadStatus>();
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: () =>
        status === "SUCCESS" || status === "FAILED" ? false : 500,
    },
  );

  const { isNotesPanelOpen } = useContext(ChatContext);

  useEffect(() => {
    setStatus(data?.status);
  }, [data?.status]);

  if (isLoading) {
    return (
      <div className="relative h-full bg-[#fafafa] rounded-xl shadow-md flex flex-col">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Indlæser...</h3>
            <p className="text-zinc-500 text-sm">
              Vi er ved at forberede din PDF.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative h-full bg-[#fafafa] rounded-xl shadow-md flex flex-col">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Analyserer din PDF...</h3>
            <p className="text-zinc-500 text-sm">Det tager ikke ret længe heldigvis!</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative h-full bg-[#fafafa] rounded-xl shadow-md flex flex-col">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-rose-500" />
            <h3 className="font-semibold text-xl">Der er for mange sider i din PDF</h3>
            <p className="text-zinc-500 text-sm">
              Din <span className="font-medium">Gratis</span> plan understøtter kun op til
              5 sider pr. PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="h-3 w-3 mr-1.5" /> Tilbage
            </Link>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <div className={`relative h-full bg-[#fafafa] rounded-xl shadow-lg flex flex-col transition-all duration-300 ease-in-out overflow-x-hidden ${isNotesPanelOpen ? 'w-[calc(100%-24rem)]' : 'w-full'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Messages fileId={fileId} />
        </div>
      </div>
      <ChatInput />
    </div>
  );
};

export const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  return (
    <ChatContextProvider fileId={fileId}>
      <ChatWrapperContent fileId={fileId} />
    </ChatContextProvider>
  );
};