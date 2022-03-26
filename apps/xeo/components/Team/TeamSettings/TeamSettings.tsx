import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import { Modal, ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import { ConnectNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/CreateNotionDatabase/ConnectNotionDatabaseButton';
import { UpdateNotionDatabaseButton } from 'components/Connections/Notion/NotionDatabase/UpdateNotionDatabase/UpdateNotionDatabaseButton';
import { Content } from 'components/Content';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useTeam } from 'hooks/useTeam';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { BasicTeamInfoForm } from './BasicTeamInfoForm';
import { TeamNotionSettings } from './TeamNotionSettings';

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
    <Button colour={ButtonColour.Dark} href={data?.url}>
      Reconnect
    </Button>
  );
};

export const TeamSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();
  const { me } = useCurrentUser();

  if (!team) {
    return <CentredLoader />;
  }

  const currentUserMember = team.members.find(
    (member) => member.userId === me?.id
  );

  return (
    <Content>
      <h2>General</h2>
      <p>General team settings</p>
      <SettingsPanel>
        <BasicTeamInfoForm team={team} />
      </SettingsPanel>

      {currentUserMember?.role === 'OWNER' ? (
        <TeamNotionSettings team={team} />
      ) : null}
    </Content>
  );
};
