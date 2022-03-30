import { NotionConnection, NotionDatabase, Team } from '@prisma/client';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { NotionDatabaseWithStatusLinks } from 'pages/api/team/[teamId]/notion';
import { UpdateNotionDatabase } from './UpdateNotionDatabase';

type Props = {
  team: Team;
  connection: NotionConnection;
  database: NotionDatabaseWithStatusLinks;
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
        <Button
          onClick={setOpen}
          variation="tertiary"
          colour={ButtonColour.Dark}
        >
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
