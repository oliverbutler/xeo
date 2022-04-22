import { NotionConnection, NotionDatabase, Team } from '@prisma/client';
import { ButtonColour } from '@xeo/ui/lib/Button/Button';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { NotionDatabaseWithStatusLinks } from 'pages/api/team/[teamId]/notion';
import { SelectColumns } from './SelectColumns';
import { SelectStatusMapping } from './SelectStatusMapping';
import { DatabaseFromNotion } from './UpdateNotionDatabase';
import { useUpdateNotionDatabase } from './useUpdateNotionDatabase';

interface Props {
  databaseFromNotion: DatabaseFromNotion;
  database: NotionDatabaseWithStatusLinks;
  team: Team;
  connection: NotionConnection;
  closeModal: () => void;
}

export const UpdateNotionDatabaseForm: React.FunctionComponent<Props> = ({
  databaseFromNotion,
  database,
  team,
  connection,
  closeModal,
}) => {
  const { form, onSubmit, availableStatusOptions } = useUpdateNotionDatabase(
    team.id,
    connection,
    database,
    closeModal,
    databaseFromNotion
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="m-10 flex max-w-none flex-col items-center justify-center">
        <div className="flex flex-col">
          <h2>Update {database.databaseName}</h2>
          <SelectColumns form={form} database={databaseFromNotion} />
          <SelectStatusMapping
            availableStatusOptions={availableStatusOptions}
            form={form}
            notionDatabase={databaseFromNotion}
            database={database}
          />
        </div>
      </div>
      <ModalFooter
        className="w-full"
        primaryVariation={ButtonColour.Secondary}
        primaryText="Update Database"
      />
    </form>
  );
};
