import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { defaultPrompts } from "./prompts";
import { generateSmartContract } from "./api";

interface AppContextType {
  prompts: string[];
  setPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  chainId: string;
  setChainId: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
  autoRunDelay: number;
  setAutoRunDelay: React.Dispatch<React.SetStateAction<number>>;
  isAutoRunning: boolean;
  startAutoRun: () => void;
  stopAutoRun: () => void;
  runPrompt: (prompt: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<string[]>(defaultPrompts);
  const [apiKey, setApiKey] = useState<string>("");
  const [chainId, setChainId] = useState<string>("11155420"); // Default to Optimism Sepolia
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRunDelay, setAutoRunDelay] = useState<number>(600);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);

  const autoRunIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const addLog = (log: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${log}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const formatResponseForLogs = (response: any) => {
    try {
      if (!response) return "No response data";

      // Just return the raw response with minimal formatting
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error formatting response: ${error instanceof Error ? error.message : String(error)}`;
    }
  };

  const runPrompt = async (prompt: string) => {
    if (!prompt) {
      addLog("Error: No prompt provided");
      return;
    }

    if (!apiKey) {
      addLog("Error: API key is required");
      return;
    }

    try {
      setLoading(true);
      // Store just the essential info
      addLog(`Running prompt: "${prompt}"`);
      addLog(`Chain ID: ${chainId}`);

      const response = await generateSmartContract(
        { apiKey, chainId },
        { prompt, chainId },
      );

      // Log success and response data
      addLog("Smart contract generated successfully");
      addLog(formatResponseForLogs(response));
    } catch (error) {
      console.error("Error running prompt:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addLog(`❌ Error: ${errorMessage}`);

      // Log detailed error information if available
      if (error instanceof Error && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.data) {
          addLog(`Error details:`);
          addLog(JSON.stringify(axiosError.response.data, null, 2));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getRandomPrompt = (): string => {
    if (prompts.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  const startAutoRun = () => {
    if (!apiKey) {
      addLog("Error: API key is required for auto-run");
      return;
    }

    setIsAutoRunning(true);
    addLog(`Starting auto-run with ${autoRunDelay} seconds delay`);

    // Run immediately with a random prompt
    const randomPrompt = getRandomPrompt();
    runPrompt(randomPrompt);

    // Set interval for subsequent runs
    autoRunIntervalRef.current = setInterval(() => {
      if (!loading) {
        const randomPrompt = getRandomPrompt();
        runPrompt(randomPrompt);
      }
    }, autoRunDelay * 1000);
  };

  const stopAutoRun = () => {
    if (autoRunIntervalRef.current) {
      clearInterval(autoRunIntervalRef.current);
      autoRunIntervalRef.current = null;
    }
    setIsAutoRunning(false);
    addLog("Auto-run stopped");
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (autoRunIntervalRef.current) {
        clearInterval(autoRunIntervalRef.current);
      }
    };
  }, []);

  // Add a log when API key is updated
  useEffect(() => {
    if (apiKey) {
      addLog("API key set");
    }
  }, [apiKey]);

  // Add a log when chain ID is changed, but skip the initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      addLog(`Chain ID set to: ${chainId}`);
    }
  }, [chainId]);

  const value = {
    prompts,
    setPrompts,
    apiKey,
    setApiKey,
    chainId,
    setChainId,
    loading,
    setLoading,
    logs,
    addLog,
    clearLogs,
    autoRunDelay,
    setAutoRunDelay,
    isAutoRunning,
    startAutoRun,
    stopAutoRun,
    runPrompt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
