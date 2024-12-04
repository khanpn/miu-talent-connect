import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const HistoryContext = createContext<string[]>([]);

const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    setHistory((prevHistory) => [
      ...prevHistory.slice(
        prevHistory.length - 4 < 0 ? 0 : prevHistory.length - 4,
        5
      ),
      location.pathname,
    ]);
  }, [location]);

  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
