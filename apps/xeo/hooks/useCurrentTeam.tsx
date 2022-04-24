import { TeamContext } from 'context/TeamContext';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { GetTeamWithMembersAndSprintsRequest } from 'pages/api/team/[teamId]';
import { useContext, useEffect } from 'react';
import { mutate } from 'swr';
import { useQuery } from 'utils/api';

export const refetchTeam = (teamId: string) => mutate(`/api/team/${teamId}`);

export const useCurrentTeam = () => {
  const { query } = useRouter();
  const {
    currentTeamId,
    setCurrentTeamId,
    setCurrentSprintId,
    currentSprintId,
  } = useContext(TeamContext);

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
  const activeSprint = sprintsOldestFirst?.find((sprint) =>
    dayjs(sprint.endDate).isAfter(dayjs())
  );

  const currentSprint = sprintsOldestFirst?.find(
    (sprint) => sprint.id === currentSprintId
  );

  useEffect(() => {
    if (teamId && typeof teamId === 'string') {
      setCurrentTeamId(teamId);
    }
  }, [teamId]);

  useEffect(() => {
    // If no sprint selected, default to the current active sprint
    if (!currentSprint && activeSprint) {
      setCurrentSprintId(activeSprint.id);
    }
  }, [currentSprint, currentTeamId, activeSprint]);

  const team = data?.team;

  const refetchCurrentTeam = async () => {
    currentTeamId && refetchTeam(currentTeamId);
  };

  return {
    team,
    error,
    isLoading,
    currentTeamId,
    currentSprint,
    setCurrentSprintId,
    activeSprint,
    sprintsOldestFirst,
    refetchCurrentTeam,
  };
};
