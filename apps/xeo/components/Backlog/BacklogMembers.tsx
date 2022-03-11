import { useState } from 'react';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';

import { GetUserSearchRequest } from 'pages/api/user/search';
import { TrashIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { BacklogSelectRole } from './BacklogSelectRole';
import { useSession } from 'next-auth/react';
import { BacklogWithMembersAndRestrictedUsers } from 'pages/api/backlog/[id]';
import { apiGet } from 'utils/api';
import { toast } from 'react-toastify';
import { Button } from '@xeo/ui/lib/Button/Button';
import { Table } from '@xeo/ui/lib/Table/Table';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { TeamWithSprintsAndMembers } from 'utils/db/team/adapter';
import { useTeam } from 'hooks/useTeam';

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

export const BacklogMembers: React.FunctionComponent<Props> = ({ team }) => {
  const { data } = useSession();
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
    (member) => member.userId === data?.id
  );

  return (
    <div className="space-y-4 bg-dark-950 p-4 mt-4 rounded-md">
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
          <Button disabled={!currentSearch} onClick={handleAddMemberClick}>
            Invite
          </Button>
        </div>
      </div>
      <h2>Edit Team Members</h2>
      <div>
        <Table<BacklogWithMembersAndRestrictedUsers['members'][0]>
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
                <BacklogSelectRole
                  team={team}
                  member={row.row.original}
                  disabled={
                    row.row.original.userId === currentUserMember?.userId
                  }
                />
              ),
            },
            {
              Header: 'Actions',
              accessor: 'userId',
              Cell: (row) =>
                row.row.original.userId === currentUserMember?.userId ? null : (
                  <div className="flex flex-row items-center">
                    <Clickable onClick={() => deleteMember(team.id, row.value)}>
                      <TrashIcon width={25} height={25} />
                    </Clickable>
                  </div>
                ),
            },
          ]}
        />
      </div>
    </div>
  );
};
