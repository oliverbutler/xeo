import { Team } from '@prisma/client';
import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Modal, ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import { ConnectNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/ConnectNotionDatabaseButton';
import { UpdateNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/UpdateNotionDatabase/UpdateNotionDatabaseButton';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useTeam } from 'hooks/useTeam';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { ReconnectToNotionButton } from './TeamSettings';

interface Props {
  team: Team;
}

export const TeamNotionSettings: React.FunctionComponent<Props> = ({
  team,
}) => {
  const { data, isLoading } = useQuery<GetTeamNotionConnectionInformation>(
    `/api/team/${team?.id}/notion`,
    !team
  );

  return (
    <div>
      <h2>Notion</h2>
      <p>Here you can configure the current connection to Notion</p>

      {isLoading ? <CentredLoader /> : null}

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
          <ReconnectToNotionButton />
        </SettingsPanel>
      )}
    </div>
  );
};
