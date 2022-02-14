import { Button, ButtonVariation } from '@xeo/ui';
import { DeleteNotionBacklog } from 'components/Connections/Notion/NotionBacklog/DeleteNotionBacklog';
import { BacklogWithMembersRestricted } from 'pages/api/connections';
import { BacklogMembers } from './BacklogMembers';

interface Props {
  backlog: BacklogWithMembersRestricted;
}

export const Backlog: React.FunctionComponent<Props> = ({ backlog }) => {
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
      <h2>Actions</h2>
      <DeleteNotionBacklog backlogId={backlog.id} />
    </div>
  );
};
