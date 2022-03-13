import { NotionConnection, Team } from '@prisma/client';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { NotionBacklog } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';

type Props = {
  team: Team;
  connection: NotionConnection;
};

export const ConnectNotionBacklogButton: React.FunctionComponent<Props> = ({
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
        <NotionBacklog
          team={team}
          notionConnectionId={connection.id}
          closeModal={setClose}
        />
      )}
    />
  );
};
