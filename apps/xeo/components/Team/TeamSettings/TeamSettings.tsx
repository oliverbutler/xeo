import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Content } from 'components/Content';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { useQuery } from 'utils/api';
import { BasicTeamInfoForm } from './BasicTeamInfoForm';
import { TeamNotionSettings } from './TeamNotionSettings';

interface Props {}

export const ReconnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return (
    <Button colour={ButtonColour.Dark} variation="tertiary" href={data?.url}>
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
