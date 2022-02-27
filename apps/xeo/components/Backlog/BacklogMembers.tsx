import { useState } from 'react';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';

import { GetUserSearchRequest } from 'pages/api/user/search';
import { TrashIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { BacklogSelectRole } from './BacklogSelectRole';
import { useSession } from 'next-auth/react';
import { BacklogWithMembersAndRestrictedUsers } from 'pages/api/backlog/[id]';
import { useBacklog } from './useBacklog';
import { apiGet } from 'utils/api';
import { toast } from 'react-toastify';
import { Button } from '@xeo/ui/lib/Button/Button';
import { Table } from '@xeo/ui/lib/Table/Table';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';

interface Props {
  backlog: BacklogWithMembersAndRestrictedUsers;
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

export const BacklogMembers: React.FunctionComponent<Props> = ({ backlog }) => {
  const { data } = useSession();
  const { deleteMember, addMember } = useBacklog();

  const [currentSearch, setCurrentSearch] = useState<
    UserSelectOption | undefined
  >();

  const debouncedFetch = debounce((searchTerm, callback) => {
    loadUserOptions(searchTerm, callback);
  }, 500);

  const handleAddMemberClick = () => {
    if (currentSearch) addMember(backlog.id, currentSearch.value);
  };

  const currentUserMember = backlog.members.find(
    (member) => member.userId === data?.id
  );

  return (
    <div>
      <h2>Invite Member to Backlog</h2>
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
      <h2>Edit Backlog Members</h2>
      <div>
        <Table<BacklogWithMembersAndRestrictedUsers['members'][0]>
          data={backlog.members}
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
                  backlog={backlog}
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
                    <Clickable
                      onClick={() => deleteMember(backlog.id, row.value)}
                    >
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
