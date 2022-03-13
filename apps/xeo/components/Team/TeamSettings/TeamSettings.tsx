import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import { Content } from 'components/Content';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { NotionSettings } from './NotionSettings';

interface Props {}

const ConnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return <Button href={data?.url}>Connect to Notion</Button>;
};

export const TeamSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();

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
        <Input label="Name" value={team.name} />
        <Input label="Short Name" value={team.shortName} />
        <Input label="Company" value={team.companyName} />
        <Button>Save</Button>
      </SettingsPanel>

      <h2>Notion</h2>
      <p>Here you can configure the current connection to Notion</p>

      {data?.notionConnection ? (
        <SettingsPanel>
          <NotionSettings connection={data.notionConnection} team={team} />
        </SettingsPanel>
      ) : (
        <SettingsPanel outline>
          No Notion Connection
          <ConnectToNotionButton />
        </SettingsPanel>
      )}
    </Content>
  );
};
