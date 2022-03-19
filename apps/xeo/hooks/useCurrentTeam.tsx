import { TeamContext } from 'context/TeamContext';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { GetTeamWithMembersAndSprintsRequest } from 'pages/api/team/[teamId]';
import { useContext, useEffect } from 'react';
import { useQuery } from 'utils/api';

export const useCurrentTeam = () => {
  const { query } = useRouter();
  const { currentTeamId, setCurrentTeamId } = useContext(TeamContext);

  const teamId = query.teamId;

  const { data, error, isLoading } =
    useQuery<GetTeamWithMembersAndSprintsRequest>(
      `/api/team/${currentTeamId}`,
      !currentTeamId
    );

  const sprintsOldestFirst = data?.team?.sprints
    .sort((a, b) => {
      return dayjs(b.endDate).diff(dayjs(a.endDate));
    })
    .reverse();

  // find the first sprint with an end date in the future
  const currentSprintId = sprintsOldestFirst?.find((sprint) =>
    dayjs(sprint.endDate).isAfter(dayjs())
  )?.id;

  useEffect(() => {
    if (teamId && typeof teamId === 'string') {
      setCurrentTeamId(teamId);
    }
  }, [teamId]);

  const team = data?.team;

  return { team, error, isLoading, currentTeamId, currentSprintId };
};
