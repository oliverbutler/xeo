import { createContext, useState } from 'react';

interface Props {}

type TeamContextType = {
  currentTeamId: string | null;
  setCurrentTeamId: (teamId: string | null) => void;
  currentSprintId: string | null;
  setCurrentSprintId: (sprintId: string | null) => void;
};

export const TeamContext = createContext<TeamContextType>({
  currentTeamId: null,
  setCurrentTeamId: () => {},
  currentSprintId: null,
  setCurrentSprintId: () => {},
});

export const TeamContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [currentSprintId, setCurrentSprintId] = useState<string | null>(null);

  return (
    <TeamContext.Provider
      value={{
        currentTeamId,
        setCurrentTeamId,
        currentSprintId,
        setCurrentSprintId,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
