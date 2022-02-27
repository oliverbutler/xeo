import useSWR from 'swr';
import { SelectStatusMapping } from './SelectStatusMapping';
import { SelectColumns } from './SelectColumns';
import { SelectDatabase } from './SelectDatabase';
import { useCreateNotionBacklog } from './useCreateNotionBacklog';
import { NotionConnection } from '@prisma/client';
import { GetConnectionNotionDatabasesRequest } from 'pages/api/connections/[id]/notion/databases';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';

export const fetcher = (input: any, init: any) =>
  fetch(input, init).then((res) => res.json());

interface NotionBacklogProps {
  notionConnectionId: NotionConnection['id'];
  closeModal: () => void;
}

export const NotionBacklog: React.FunctionComponent<NotionBacklogProps> = ({
  notionConnectionId,
  closeModal,
}) => {
  const { data, error } = useSWR<
    GetConnectionNotionDatabasesRequest['responseBody'],
    string
  >(`/api/connections/${notionConnectionId}/notion/databases`, fetcher);

  const { onSubmit, form } = useCreateNotionBacklog(
    notionConnectionId,
    closeModal
  );

  if (error) {
    return <div>Error Loading!</div>;
  }

  return (
    <>
      <div className="m-10 flex max-w-none flex-col items-center justify-center">
        <h2>Add Backlog</h2>
        <form className="flex flex-col">
          <SelectDatabase form={form} databaseQueryData={data} error={error} />
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
