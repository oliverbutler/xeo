import { Button, ButtonVariation } from '@xeo/ui';
import { DeleteNotionBacklog } from 'components/Connections/Notion/NotionBacklog/DeleteNotionBacklog';
import { useSession } from 'next-auth/react';
import { BacklogWithMembersAndRestrictedUsers } from 'pages/api/backlog/[id]';

import { BacklogMembers } from './BacklogMembers';

interface Props {
  backlog: BacklogWithMembersAndRestrictedUsers;
}

export const Backlog: React.FunctionComponent<Props> = ({ backlog }) => {
  const { data } = useSession();
  const userId = data?.id;

  const isUserOwnerOfBacklog =
    backlog.notionConnection.createdByUserId === userId;

  return (
    <div className="p-10">
      <div className="flex flex-row justify-between">
        <h1>Edit {backlog.databaseName}</h1>
        <div>
          <Button href="/connections" variation={ButtonVariation.Dark}>
            Back
          </Button>
        </div>
      </div>
      <BacklogMembers backlog={backlog} />
      {isUserOwnerOfBacklog ? (
        <div>
          <h2>Actions</h2>
          <DeleteNotionBacklog backlog={backlog} />
        </div>
      ) : null}
    </div>
  );
};
