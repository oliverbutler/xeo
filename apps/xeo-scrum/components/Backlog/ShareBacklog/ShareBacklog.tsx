import { useState } from 'react';
import { AsyncSelect, Clickable, Modal, ModalFooter } from '@xeo/ui';
import axios from 'axios';
import { GetUserSearchRequest } from 'pages/api/user/search';
import { toast } from 'react-toastify';
import { BacklogWithMembersRestricted } from 'pages/api/connections';
import { UserAddIcon } from '@heroicons/react/outline';

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

  if (result.status !== 200) {
    toast.error(`Error loading users: ${result.statusText}`);
    return;
  }

  const options = result.data.users.map((user) => ({
    value: user.id,
    label: user.name ?? '',
  }));

  callback(options);
};

export const ShareBacklog: React.FunctionComponent<Props> = ({ backlog }) => {
  const [currentSearch, setCurrentSearch] = useState<string | undefined>();

  return (
    <Modal
      mainText="Add Members"
      trigger={(setOpen) => (
        <Clickable onClick={setOpen}>
          <UserAddIcon width={25} height={25} />
        </Clickable>
      )}
      content={(setClosed) => (
        <>
          <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
            <h2>Edit Backlog Members</h2>
            <div>
              {backlog.members.map((member) => (
                <div key={member.userId}>
                  <p>{member.user.name}</p>
                </div>
              ))}
              <AsyncSelect<UserSelectOption>
                cacheOptions
                defaultOptions
                label="Add User"
                loadOptions={loadUserOptions}
                onChange={(e) => setCurrentSearch(e?.value)}
              />
            </div>
          </div>
          <ModalFooter primaryText="Close" clickPrimary={setClosed} />
        </>
      )}
    />
  );
};
