import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import dayjs from 'dayjs';
import { NotionConnectionInformation } from 'utils/db/notionConnection/adapter';
import { TeamWithSprintsAndMembers } from 'utils/db/team/adapter';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ConnectNotionDatabaseButton } from '../../Connections/Notion/NotionDatabase/ConnectNotionDatabaseButton';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useQuery } from 'utils/api';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';

dayjs.extend(LocalizedFormat);

export const ReconnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return (
    <Button
      variation={ButtonVariation.Dark}
      href={data?.url}
      className="ml-auto"
    >
      Reconnect
    </Button>
  );
};

interface Props {
  team: TeamWithSprintsAndMembers;
  connection: NotionConnectionInformation;
}

export const NotionSettings: React.FunctionComponent<Props> = ({
  team,
  connection,
}) => {
  return (
    <div>
      <h3>Notion Connection</h3>
      <div className="flex flex-row items-center">
        <NotionLogoRenderer iconString={connection.notionWorkspaceIcon} />
        <div className="ml-4">
          <p>Name: {connection.notionWorkspaceName}</p>
        </div>
        <ReconnectToNotionButton />
      </div>
      <h3>Notion Database</h3>
      {connection.notionDatabase ? (
        <p>Name: {connection.notionDatabase.databaseName}</p>
      ) : (
        <ConnectNotionDatabaseButton team={team} connection={connection} />
      )}
    </div>
  );
};
