import { SelectStatusMapping } from './SelectStatusMapping';
import { SelectColumns } from './SelectColumns';
import { SelectDatabase } from './SelectDatabase';
import { useCreateNotionBacklog } from './useCreateNotionBacklog';
import { NotionConnection, Team } from '@prisma/client';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { useQuery } from 'utils/api';
import { GetConnectionNotionDatabasesRequest } from 'pages/api/team/[teamId]/notion/databases';

export const fetcher = (input: any, init: any) =>
  fetch(input, init).then((res) => res.json());

interface NotionBacklogProps {
  team: Team;
  notionConnectionId: NotionConnection['id'];
  closeModal: () => void;
}

export const CreateNotionDatabase: React.FunctionComponent<
  NotionBacklogProps
> = ({ team, notionConnectionId, closeModal }) => {
  const { data, error } = useQuery<GetConnectionNotionDatabasesRequest>(
    `/api/team/${team.id}/notion/databases`
  );

  const { onSubmit, form } = useCreateNotionBacklog(
    team.id,
    notionConnectionId,
    closeModal
  );

  if (error) {
    return <div>Error Loading!</div>;
  }

  return (
    <>
      <div className="m-10 flex max-w-none flex-col items-center justify-center">
        <h2>Add Database</h2>
        <form className="flex flex-col">
          <SelectDatabase form={form} databases={data?.notionResponse} />
          <SelectColumns form={form} />
          <SelectStatusMapping form={form} />
        </form>
      </div>
      <ModalFooter
        className="w-full"
        primaryText="Add Backlog"
        clickPrimary={() => onSubmit()}
      />
    </>
  );
};
