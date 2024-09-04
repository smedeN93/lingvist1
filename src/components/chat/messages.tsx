import { useIntersection } from "@mantine/hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import SimpleBar from "simplebar-react";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

import { ChatContext } from "./chat-context";
import { Message } from "./message";

import "simplebar-react/dist/simplebar.min.css";

export const Messages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isAIThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        placeholderData: keepPreviousData,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-4 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAIThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <SimpleBar autoHide={false} className="max-h-[calc(100vh-3.5rem-7rem)] pr-4">
      <div className="flex flex-1 flex-col-reverse gap-4 pb-24 pl-4">
        {combinedMessages && combinedMessages.length > 0 ? (
          combinedMessages.map((message, i) => {
            const isNextMessageSamePerson =
              combinedMessages[i - 1]?.isUserMessage ===
              combinedMessages[i]?.isUserMessage;

            if (i === combinedMessages.length - 1) {
              return (
                <Message
                  ref={ref}
                  key={message.id}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  message={message}
                />
              );
            }

            return (
              <Message
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          })
        ) : isLoading ? (
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h3 className="font-semibold text-xl">Så er du klar!</h3>
            <p className="text-zinc-500 text-sm">
              Stil dit første spørgsmål for at komme i gang.
            </p>
          </div>
        )}
      </div>
    </SimpleBar>
  );
};
