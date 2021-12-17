import { createContext, useContext, useState } from 'react';

const SyncContext = createContext<SyncContextProps>({
  isSyncing: false,
  setIsSyncing: () => undefined,
});

interface SyncContextProps {
  isSyncing: boolean;
  setIsSyncing: (sync: boolean) => void;
}

export const useSyncContext = () => useContext(SyncContext);

export const SyncContextProvider: React.FunctionComponent = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <SyncContext.Provider value={{ isSyncing, setIsSyncing }}>
      {children}
    </SyncContext.Provider>
  );
};
