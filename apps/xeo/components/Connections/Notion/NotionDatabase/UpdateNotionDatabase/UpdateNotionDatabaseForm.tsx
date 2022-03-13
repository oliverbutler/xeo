import { NotionConnection, NotionDatabase, Team } from '@prisma/client';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { SelectColumns } from './SelectColumns';
import { SelectStatusMapping } from './SelectStatusMapping';
import { DatabaseFromNotion } from './UpdateNotionDatabase';
import { useUpdateNotionDatabase } from './useUpdateNotionDatabase';

interface Props {
  databaseFromNotion: DatabaseFromNotion;
  database: NotionDatabase;
  team: Team;
  connection: NotionConnection;
  closeModal: () => void;
}

export const UpdateNotionDatabaseForm: React.FunctionComponent<Props> = ({
  databaseFromNotion,
  database: currentNotionDatabase,
  team,
  connection,
  closeModal,
}) => {
  const { form, onSubmit } = useUpdateNotionDatabase(
    team.id,
    connection,
    currentNotionDatabase,
    closeModal,
    databaseFromNotion
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="m-10 flex max-w-none flex-col items-center justify-center">
        <div className="flex flex-col">
          <h2>Update Database</h2>
          <SelectColumns form={form} database={databaseFromNotion} />
          <SelectStatusMapping form={form} database={databaseFromNotion} />
        </div>
      </div>
      <ModalFooter className="w-full" primaryText="Update Database" />
    </form>
  );
};
