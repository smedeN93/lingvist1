import { useIntersection } from "@mantine/hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef, useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import SimpleBar from "simplebar-react";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

import { ChatContext } from "./chat-context";
import { Message } from "./message";

import "simplebar-react/dist/simplebar.min.css";

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

  const combinedMessages = useMemo(() => [
    ...(isAIThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ], [isAIThinking, messages]);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const prevMessagesLengthRef = useRef(combinedMessages.length);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && autoScroll) {
      if (combinedMessages.length > prevMessagesLengthRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    }
    prevMessagesLengthRef.current = combinedMessages.length;
  }, [combinedMessages, autoScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const atBottom = scrollHeight - scrollTop === clientHeight;
        setAutoScroll(atBottom);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <SimpleBar autoHide={false} className="max-h-[calc(100vh-3.5rem-7rem)]" scrollableNodeProps={{ ref: containerRef }}>
      <div className="flex flex-1 flex-col-reverse gap-4 pb-24 pl-4 pr-4">
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
          <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="bg-blue-100 rounded-full p-3">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-2xl text-gray-800">Så er du klar!</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Stil dit første spørgsmål for at komme i gang.
                </p>
              </div>
        )}
      </div>
    </SimpleBar>
  );
};