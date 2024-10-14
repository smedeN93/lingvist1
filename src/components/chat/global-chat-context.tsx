import { type PropsWithChildren, createContext, useState } from "react";

export type Message = {
  id: string;
  text: string;
  isUserMessage: boolean;
};

export type GlobalChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalChatContext = createContext<GlobalChatContextType>({
  messages: [],
  setMessages: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const GlobalChatContextProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalChatContext.Provider>
  );
};