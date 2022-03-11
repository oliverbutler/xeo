import { Select } from '@xeo/ui/lib/Select/Select';
import { Input } from '@xeo/ui/lib/Input/Input';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { useQuery } from 'utils/api';
import { Team } from '@prisma/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type TeamSelectOption = {
  value: Team;
  label: string;
};

export const Navbar: React.FunctionComponent = () => {
  const { data, isLoading } = useQuery<GetTeamsForUserRequest>('/api/team');

  const { me, updateUserMetadata } = useCurrentUser();
  const { pathname, push } = useRouter();

  const teamOptions: TeamSelectOption[] =
    data?.teams.map((team) => ({
      value: team,
      label: team.name,
    })) ?? [];

  const currentOptionSelected = teamOptions.find(
    (option) => option.value.id === me?.metadata?.defaultTeamId
  );

  const handleChange = (option: TeamSelectOption) => {
    updateUserMetadata({
      defaultTeamId: option.value.id,
    });
  };

  // If the user is on / and they HAVE a team, redirect them to /team/:id
  useEffect(() => {
    if (pathname === '/' && me?.metadata?.defaultTeamId) {
      push(`/team/${me.metadata.defaultTeamId}`);
    }
  });

  return (
    <div className="overflow-auto p-4 dark:bg-dark-900">
      <div className="flex flex-row grow">
        <div className="grow">
          <h1 className="mb-0">Welcome {me?.name}</h1>
          <p className="mt-2">Check out your current Team performance</p>
        </div>
        <div className="flex flex-row space-x-4">
          <Select
            className="w-72"
            label=""
            placeholder="Team"
            options={teamOptions}
            isLoading={isLoading}
            value={currentOptionSelected}
            onChange={handleChange as any}
          />
        </div>
      </div>
    </div>
  );
};
