import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import { ConnectNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/ConnectNotionDatabaseButton';
import { UpdateNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/UpdateNotionDatabase/UpdateNotionDatabaseButton';
import { Content } from 'components/Content';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useTeam } from 'hooks/useTeam';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { BasicTeamInfoForm } from './BasicTeamInfoForm';

interface Props {}

const ConnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return <Button href={data?.url}>Connect to Notion</Button>;
};

export const ReconnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return (
    <Button variation={ButtonVariation.Dark} href={data?.url}>
      Reconnect
    </Button>
  );
};

export const TeamSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();
  const { deleteTeam } = useTeam();

  const { data, error } = useQuery<GetTeamNotionConnectionInformation>(
    `/api/team/${team?.id}/notion`,
    !team
  );

  if (!team) {
    return <CentredLoader />;
  }

  return (
    <Content>
      <h2>General</h2>
      <p>General team settings</p>
      <SettingsPanel>
        <BasicTeamInfoForm team={team} />
      </SettingsPanel>

      <h2>Notion</h2>
      <p>Here you can configure the current connection to Notion</p>

      {data?.notionConnection ? (
        <>
          <SettingsPanel>
            <div className="flex flex-row">
              <NotionLogoRenderer
                iconString={data.notionConnection.notionWorkspaceIcon}
              />
              <div className="ml-4">
                <p>Name: {data.notionConnection.notionWorkspaceName}</p>
              </div>
              <div className="ml-auto">
                <ReconnectToNotionButton />
              </div>
            </div>
          </SettingsPanel>

          <h2>Notion Database</h2>
          <p>
            This is the database within your Notion Connection which we use for
            your Xeo Team
          </p>

          {data?.notionConnection.notionDatabase ? (
            <SettingsPanel>
              <div className="flex flex-row">
                <div>
                  <p>
                    <b>Name: </b>
                    {data.notionConnection.notionDatabase.databaseName}
                  </p>
                  <p>
                    <b>Updated At:</b>{' '}
                    {data.notionConnection.notionDatabase.updatedAt}
                  </p>
                </div>
                <div className="ml-auto">
                  <UpdateNotionDatabaseButton
                    team={team}
                    database={data.notionConnection.notionDatabase}
                    connection={data.notionConnection}
                  />
                </div>
              </div>
            </SettingsPanel>
          ) : (
            <SettingsPanel outline={!data?.notionConnection?.notionDatabase}>
              <ConnectNotionDatabaseButton
                team={team}
                connection={data.notionConnection}
              />
            </SettingsPanel>
          )}
        </>
      ) : (
        <SettingsPanel outline>
          No Notion Connection
          <ConnectToNotionButton />
        </SettingsPanel>
      )}
      <h2>Actions</h2>
      <Button
        variation={ButtonVariation.Danger}
        onClick={() => deleteTeam(team.id)}
      >
        Delete Team
      </Button>
    </Content>
  );
};
