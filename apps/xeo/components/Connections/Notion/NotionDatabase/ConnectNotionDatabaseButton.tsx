import { NotionConnection, Team } from '@prisma/client';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { CreateNotionDatabase } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/CreateNotionDatabase';

type Props = {
  team: Team;
  connection: NotionConnection;
};

export const ConnectNotionDatabaseButton: React.FunctionComponent<Props> = ({
  team,
  connection,
}) => {
  return (
    <Modal
      mainText="Add Backlog"
      trigger={(setOpen) => (
        <Button onClick={setOpen} variation={ButtonVariation.Secondary}>
          Connect to Database
        </Button>
      )}
      content={(setClose) => (
        <CreateNotionDatabase
          team={team}
          notionConnectionId={connection.id}
          closeModal={setClose}
        />
      )}
    />
  );
};
