import { type PropsWithChildren, createContext, useState, useCallback } from "react";

export type Message = {
  id: string;
  text: string;
  isUserMessage: boolean;
  isLoading?: boolean;
  error?: string;
};

export type GlobalChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateMessageById: (id: string, updates: Partial<Message>) => void;
  addMessage: (message: Message) => void;
};

export const GlobalChatContext = createContext<GlobalChatContextType>({
  messages: [],
  setMessages: () => {},
  isLoading: false,
  setIsLoading: () => {},
  updateMessageById: () => {},
  addMessage: () => {},
});

export const GlobalChatContextProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateMessageById = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, ...updates } : message
      )
    );
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return (
    <GlobalChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        updateMessageById,
        addMessage,
      }}
    >
      {children}
    </GlobalChatContext.Provider>
  );
};
