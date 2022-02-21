import { useState } from 'react';
import { AsyncSelect, Clickable, Button, Table } from '@xeo/ui';
import axios from 'axios';
import { GetUserSearchRequest } from 'pages/api/user/search';
import { BacklogWithMembersRestricted } from 'pages/api/connections';
import { TrashIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import _ from 'lodash';
import { PutCreateBacklogMember } from 'pages/api/backlog/[id]/members';
import { apiDelete, apiPut } from 'utils/api';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { DeleteBacklogMember } from 'pages/api/backlog/[id]/members/[memberId]';

interface Props {
  backlog: BacklogWithMembersRestricted;
}

type UserSelectOption = {
  value: string;
  label: string;
};

const loadUserOptions = async (
  inputValue: string,
  callback: (options: UserSelectOption[]) => void
) => {
  const result = await axios.get<GetUserSearchRequest['responseBody']>(
    `/api/user/search?searchString=${inputValue}`
  );

  if (!result?.data?.user) {
    return;
  }

  const options: UserSelectOption[] = result.data.user
    ? [
        {
          value: result.data.user.id,
          label: `${result.data.user.name} - ${result.data.user.email}`,
        },
      ]
    : [];

  console.log(options);

  callback(options);
};

const handleAddMember = async (backlogId: string, userId: string) => {
  const result = await apiPut<PutCreateBacklogMember>(
    `/api/backlog/${backlogId}/members`,
    { userId }
  );

  if (result.genericError) {
    toast.error(result.error?.message || result.genericError);
  } else {
    toast.success('Member added');
    mutate(`/api/backlog/${backlogId}`);
  }
};

const handleDeleteMember = async (backlogId: string, userId: string) => {
  const result = await apiDelete<DeleteBacklogMember>(
    `/api/backlog/${backlogId}/members/${userId}`
  );

  if (result.genericError) {
    toast.error(result.error?.message || result.genericError);
  } else {
    toast.success('Member deleted');
    mutate(`/api/backlog/${backlogId}`);
  }
};

export const BacklogMembers: React.FunctionComponent<Props> = ({ backlog }) => {
  const [currentSearch, setCurrentSearch] = useState<
    UserSelectOption | undefined
  >();

  const debouncedFetch = _.debounce((searchTerm, callback) => {
    loadUserOptions(searchTerm, callback);
  }, 500);

  const handleAddMemberClick = () => {
    if (currentSearch) handleAddMember(backlog.id, currentSearch.value);
  };

  return (
    <div>
      <h2>Invite Member to Backlog</h2>
      <div className="flex flex-row gap-2 w-full">
        <div>
          <AsyncSelect<UserSelectOption>
            cacheOptions
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
        <Table<BacklogWithMembersRestricted['members'][0]>
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
                  <p>{cell.value.name}</p>
                </div>
              ),
            },
            { Header: 'Email', accessor: (row) => row.user.email ?? '' },
            {
              Header: 'Actions',
              accessor: 'userId',
              Cell: (row) => (
                <div>
                  <Clickable
                    onClick={() => handleDeleteMember(backlog.id, row.value)}
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
