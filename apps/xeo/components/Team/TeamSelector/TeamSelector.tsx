import { Team } from '@prisma/client';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { useQuery } from 'utils/api';
import { Listbox } from '@xeo/ui/lib/Listbox/Listbox';
import { mutate } from 'swr';
import { useContext } from 'react';
import { TeamContext } from 'context/TeamContext';

type TeamSelectOption = {
  value: Team;
  label: string;
};

export const TeamSelector: React.FunctionComponent = () => {
  const { data } = useQuery<GetTeamsForUserRequest>('/api/team');
  const { me, updateUserMetadata } = useCurrentUser();
  const { setCurrentTeamId } = useContext(TeamContext);

  const teamOptions: TeamSelectOption[] =
    data?.teams.map((team) => ({
      value: team,
      label: `${team.shortName} - ${team.name}`,
    })) ?? [];

  const currentOptionSelected = teamOptions.find(
    (option) => option.value.id === me?.metadata?.defaultTeamId
  );

  const handleChange = async (option: TeamSelectOption) => {
    const newTeamId = option.value.id;

    await updateUserMetadata({
      defaultTeamId: newTeamId,
    });

    // Reload Window
    window.location.reload();
  };

  return (
    <Listbox
      options={teamOptions}
      value={currentOptionSelected}
      onChange={handleChange}
    />
  );
};
