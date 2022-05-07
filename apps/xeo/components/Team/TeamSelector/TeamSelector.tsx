import { Sprint, Team } from '@prisma/client';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { useQuery } from 'utils/api';
import { BaseListboxOption, Listbox } from '@xeo/ui/lib/Listbox/Listbox';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { Badge } from 'components/Badge/Badge';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import classNames from 'classnames';

var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

type TeamSelectOption = {
  value: Team;
  label: string;
};

type SprintSelectOption = {
  value: string;
  label: React.ReactNode;
};

export const SprintStatusBadge: React.FunctionComponent<{
  sprint: Sprint;
}> = ({ sprint }) => {
  // @ts-ignore
  const isSprintActive = dayjs().isBetween(
    sprint.startDate,
    sprint.endDate,
    null,
    '()'
  );

  const isSprintOver = dayjs().isAfter(sprint.endDate);

  if (isSprintOver) {
    return <Badge variant="secondary" text="Complete" />;
  }

  if (isSprintActive) {
    return <Badge variant="success" text="Active" />;
  }

  return <Badge variant="warning" text="Upcoming" />;
};

export const TeamSelector: React.FunctionComponent<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  const { data } = useQuery<GetTeamsForUserRequest>('/api/team');
  const { me, updateUserDefaultTeam } = useCurrentUser();
  const { currentSprint, setCurrentSprintId, sprintsOldestFirst } =
    useCurrentTeam();
  const router = useRouter();

  const teamOptions: TeamSelectOption[] =
    data?.teams.map((team) => ({
      value: team,
      label: `${team.shortName} - ${team.name}`,
    })) ?? [];

  const sprintOptions: SprintSelectOption[] =
    sprintsOldestFirst?.map((sprint) => ({
      value: sprint.id,
      label: (
        <div className="flex flex-row items-center">
          <span className="mr-2">{sprint.name}</span>
          <SprintStatusBadge sprint={sprint} />
        </div>
      ),
    })) ?? [];

  const currentSprintOptionSelected = sprintOptions.find(
    (sprint) => sprint.value === currentSprint?.id
  );

  const currentOptionSelected = teamOptions.find(
    (option) => option.value.id === me?.metadata?.defaultTeamId
  );

  const handleChange = async (option: TeamSelectOption) => {
    const newTeamId = option.value.id;
    await updateUserDefaultTeam(newTeamId);

    router.push(`/team/${newTeamId}`);
    window.location.reload();
  };

  const handleSprintChange = async (option: SprintSelectOption) => {
    setCurrentSprintId(option.value);
  };

  return (
    <div className={classNames('flex flex-col', { dark: !isMobile })}>
      <Listbox
        options={sprintOptions}
        value={currentSprintOptionSelected}
        onChange={handleSprintChange}
      />
      <Listbox
        options={teamOptions}
        value={currentOptionSelected}
        onChange={handleChange}
      />
    </div>
  );
};
