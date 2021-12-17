import { createContext, useContext, useState } from 'react';

const PageContext = createContext<SyncContextProps>({
  currentPageId: null,
  setCurrentPageId: () => undefined,
});

interface SyncContextProps {
  currentPageId: string | null;
  setCurrentPageId: (pageId: string | null) => void;
}

export const usePageContext = () => useContext(PageContext);

export const PageContextProvider: React.FunctionComponent = ({ children }) => {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  return (
    <PageContext.Provider value={{ currentPageId, setCurrentPageId }}>
      {children}
    </PageContext.Provider>
  );
};
