import { TeamContext } from 'context/TeamContext';
import { useRouter } from 'next/router';
import { GetTeamWithMembersAndSprintsRequest } from 'pages/api/team/[teamId]';
import { useContext, useEffect } from 'react';
import { useQuery } from 'utils/api';

export const useCurrentTeam = () => {
  const { query } = useRouter();
  const { currentTeamId, setCurrentTeamId } = useContext(TeamContext);

  const teamId = query.teamId;

  useEffect(() => {
    if (teamId && typeof teamId === 'string') {
      setCurrentTeamId(teamId);
    }
  }, [teamId]);

  const { data, error, isLoading } =
    useQuery<GetTeamWithMembersAndSprintsRequest>(
      `/api/team/${currentTeamId}`,
      !currentTeamId
    );

  const team = data?.team;

  return { team, error, isLoading, currentTeamId };
};
