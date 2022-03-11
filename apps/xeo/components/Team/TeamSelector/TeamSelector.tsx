import { Team } from '@prisma/client';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useRouter } from 'next/router';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { useQuery } from 'utils/api';
import { Listbox } from '@xeo/ui/lib/Listbox/Listbox';

type TeamSelectOption = {
  value: Team;
  label: string;
};

export const TeamSelector: React.FunctionComponent = () => {
  const { data } = useQuery<GetTeamsForUserRequest>('/api/team');
  const { me, updateUserMetadata } = useCurrentUser();
  const { push } = useRouter();

  const teamOptions: TeamSelectOption[] =
    data?.teams.map((team) => ({
      value: team,
      label: `${team.shortName} - ${team.name}`,
    })) ?? [];

  const currentOptionSelected = teamOptions.find(
    (option) => option.value.id === me?.metadata?.defaultTeamId
  );

  const handleChange = (option: TeamSelectOption) => {
    updateUserMetadata({
      defaultTeamId: option.value.id,
    });
    push(`/team/${option.value.id}`);
  };

  return (
    <Listbox
      options={teamOptions}
      value={currentOptionSelected}
      onChange={handleChange}
    />
  );
};
