import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import { ConnectNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/ConnectNotionDatabaseButton';
import { UpdateNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/UpdateNotionDatabase/UpdateNotionDatabaseButton';
import { Content } from 'components/Content';
import { EpicSettings } from 'components/Epic/EpicSettings';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { ReconnectToNotionButton } from './TeamSettings';

export const TeamNotionSettings: React.FunctionComponent = () => {
  const { team } = useCurrentTeam();

  const { data, isLoading } = useQuery<GetTeamNotionConnectionInformation>(
    `/api/team/${team?.id}/notion`,
    !team
  );

  const { me } = useCurrentUser();

  const currentUserMember = team?.members.find(
    (member) => member.userId === me?.id
  );

  const isUserOwner = currentUserMember?.role === 'OWNER';

  if (!team || isLoading) {
    return <CentredLoader />;
  }

  return (
    <Content>
      {isUserOwner ? (
        <>
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
                    <p>{data.notionConnection.notionWorkspaceName}</p>
                  </div>
                  <div className="ml-auto">
                    <ReconnectToNotionButton />
                  </div>
                </div>
              </SettingsPanel>

              <h2>Notion Database</h2>
              <p>
                This is the database within your Notion Connection which we use
                for your Xeo Team
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
                <SettingsPanel
                  outline={!data?.notionConnection?.notionDatabase}
                >
                  <ConnectNotionDatabaseButton
                    team={team}
                    connection={data.notionConnection}
                  />
                </SettingsPanel>
              )}
            </>
          ) : (
            <SettingsPanel outline>
              <ReconnectToNotionButton />
            </SettingsPanel>
          )}
        </>
      ) : null}
      <EpicSettings />
    </Content>
  );
};
