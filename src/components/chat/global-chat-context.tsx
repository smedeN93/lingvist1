import { type PropsWithChildren, createContext, useState, useCallback } from "react";

export type Message = {
  id: string;
  text: string;
  isUserMessage: boolean;
  isLoading?: boolean;
  error?: string;
};

export type LoadingStep = {
  label: string;
  status: 'pending' | 'active' | 'completed';
};

export type GlobalChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateMessageById: (id: string, updates: Partial<Message>) => void;
  addMessage: (message: Message) => void;
  loadingStatus: string | null;
  setLoadingStatus: React.Dispatch<React.SetStateAction<string | null>>;
  loadingSteps: LoadingStep[];
  setLoadingSteps: React.Dispatch<React.SetStateAction<LoadingStep[]>>;
  fileCount: number;
  setFileCount: React.Dispatch<React.SetStateAction<number>>;
};

export const GlobalChatContext = createContext<GlobalChatContextType>({
  messages: [],
  setMessages: () => {},
  isLoading: false,
  setIsLoading: () => {},
  updateMessageById: () => {},
  addMessage: () => {},
  loadingStatus: null,
  setLoadingStatus: () => {},
  loadingSteps: [],
  setLoadingSteps: () => {},
  fileCount: 0,
  setFileCount: () => {},
});

export const GlobalChatContextProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([]);
  const [fileCount, setFileCount] = useState(0);

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
        loadingStatus,
        setLoadingStatus,
        loadingSteps,
        setLoadingSteps,
        fileCount,
        setFileCount,
      }}
    >
      {children}
    </GlobalChatContext.Provider>
  );
};
