import { useState } from 'react';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';

import { GetUserSearchRequest } from 'pages/api/user/search';
import { TrashIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { TeamMemberSelectRole } from './TeamMemberSelectRole';
import { useSession } from 'next-auth/react';
import { apiGet } from 'utils/api';
import { toast } from 'react-toastify';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Table } from '@xeo/ui/lib/Table/Table';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { TeamWithSprintsAndMembers } from 'utils/db/team/adapter';
import { useTeam } from 'hooks/useTeam';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { Content } from 'components/Content';
import { TeamMember, TeamRole } from '@prisma/client';
import { useCurrentUser } from 'hooks/useCurrentUser';

interface Props {
  team: TeamWithSprintsAndMembers;
}

type UserSelectOption = {
  value: string;
  label: string;
};

const loadUserOptions = async (
  inputValue: string,
  callback: (options: UserSelectOption[]) => void
) => {
  const { data, error } = await apiGet<GetUserSearchRequest>(
    `/api/user/search?searchString=${inputValue}`
  );

  if (error) {
    toast.error(error.body?.message || error.generic);
    callback([]);
    return;
  }

  const options: UserSelectOption[] = data?.user
    ? [
        {
          value: data.user.id,
          label: `${data.user.name} - ${data.user.email}`,
        },
      ]
    : [];

  callback(options);
};

export const TeamMembers: React.FunctionComponent<Props> = ({ team }) => {
  const { me } = useCurrentUser();
  const { deleteMember, addMember } = useTeam();

  const [currentSearch, setCurrentSearch] = useState<
    UserSelectOption | undefined
  >();

  const debouncedFetch = debounce((searchTerm, callback) => {
    loadUserOptions(searchTerm, callback);
  }, 500);

  const handleAddMemberClick = () => {
    if (currentSearch) addMember(team.id, currentSearch.value);
  };

  const currentUserMember = team.members.find(
    (member) => member.userId === me?.id
  );

  const isMemberEditable = (member: TeamMember) => {
    return (
      member.userId !== currentUserMember?.userId &&
      member.role !== TeamRole.OWNER
    );
  };

  return (
    <Content>
      <h2>Edit Team Members</h2>
      <p>Configure the members of your team</p>
      <ul>
        <li>
          <b>Owners</b> connect to the Notion board
        </li>
        <li>
          <b>Admins</b> can do everything owners can, but they don't control the
          connection
        </li>
        <li>
          <b>Members</b> can add and view sprints (devs and external people)
        </li>
      </ul>

      <SettingsPanel>
        {currentUserMember?.role === TeamRole.MEMBER ? null : (
          <div className="flex flex-row gap-2 w-full">
            <div>
              <AsyncSelect<UserSelectOption>
                cacheOptions
                className="w-64"
                label=""
                loadOptions={debouncedFetch}
                onChange={(e) => setCurrentSearch(e ?? undefined)}
                isClearable
              />
            </div>

            <div className="mt-auto">
              <Button
                disabled={!currentSearch}
                onClick={handleAddMemberClick}
                variation="tertiary"
              >
                Invite
              </Button>
            </div>
          </div>
        )}

        <div>
          <Table<TeamWithSprintsAndMembers['members'][0]>
            data={team.members}
            columns={[
              {
                Header: 'Name',
                accessor: 'user',
                Cell: (cell) => (
                  <div className="flex flex-row items-center">
                    {cell.value.image ? (
                      <div className="mr-2">
                        <Image
                          className="rounded-full"
                          src={cell.value.image}
                          height={30}
                          width={30}
                          alt={cell.value.name ?? ''}
                        />
                      </div>
                    ) : null}
                    <span>{cell.value.name}</span>
                  </div>
                ),
              },
              { Header: 'Email', accessor: (row) => row.user.email ?? '' },
              {
                Header: 'Role',
                accessor: 'role',
                Cell: (row) => (
                  <TeamMemberSelectRole
                    team={team}
                    member={row.row.original}
                    disabled={!isMemberEditable(row.row.original)}
                  />
                ),
              },
              {
                Header: 'Actions',
                accessor: 'userId',
                Cell: (row) =>
                  isMemberEditable(row.row.original) ? (
                    <div className="flex flex-row items-center">
                      <Clickable
                        onClick={() => deleteMember(team.id, row.value)}
                      >
                        <TrashIcon width={25} height={25} />
                      </Clickable>
                    </div>
                  ) : null,
              },
            ]}
          />
        </div>
      </SettingsPanel>
    </Content>
  );
};
