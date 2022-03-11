import { useRouter } from 'next/router';
import { GetTeamWithMembersAndSprintsRequest } from 'pages/api/team/[teamId]';
import { useQuery } from 'utils/api';

export const useCurrentTeam = () => {
  const { query } = useRouter();

  const teamId = query.teamId;

  const { data, error, isLoading } =
    useQuery<GetTeamWithMembersAndSprintsRequest>(`/api/team/${teamId}`);

  const team = data?.team;

  return { team, error, isLoading };
};
