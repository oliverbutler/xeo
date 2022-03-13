import { NotionConnection, NotionDatabase, Team } from '@prisma/client';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { CreateNotionDatabase } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/CreateNotionDatabase';
import { UpdateNotionDatabase } from './UpdateNotionDatabase';

type Props = {
  team: Team;
  connection: NotionConnection;
  database: NotionDatabase;
};

export const UpdateNotionDatabaseButton: React.FunctionComponent<Props> = ({
  team,
  connection,
  database,
}) => {
  return (
    <Modal
      mainText="Update Database"
      trigger={(setOpen) => (
        <Button onClick={setOpen} variation={ButtonVariation.Dark}>
          Update Database
        </Button>
      )}
      content={(setClose) => (
        <UpdateNotionDatabase
          team={team}
          connection={connection}
          database={database}
          closeModal={setClose}
        />
      )}
    />
  );
};
