import { createContext, useState } from 'react';

interface Props {}

type TeamContextType = {
  currentTeamId: string | null;
  setCurrentTeamId: (teamId: string | null) => void;
};

export const TeamContext = createContext<TeamContextType>({
  currentTeamId: null,
  setCurrentTeamId: () => {},
});

export const TeamContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);

  return (
    <TeamContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
      {children}
    </TeamContext.Provider>
  );
};
