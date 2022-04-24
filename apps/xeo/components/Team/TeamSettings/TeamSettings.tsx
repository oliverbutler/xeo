import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Modal, ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { Content } from 'components/Content';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useTeam } from 'hooks/useTeam';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { useQuery } from 'utils/api';
import { BasicTeamInfoForm } from './BasicTeamInfoForm';

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
  const { deleteTeam } = useTeam();

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
      <h2>Actions</h2>
      <Modal
        mainText="Delete Team"
        trigger={(setOpen) => (
          <Button
            onClick={() => {
              setOpen();
            }}
            colour={ButtonColour.Danger}
            variation="tertiary"
          >
            Delete Team
          </Button>
        )}
        content={(setClose) => (
          <>
            <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
              <h2>
                Delete <i>{team.name}</i>?
              </h2>
              <p>
                This action is irreversible and will delete all associated
                Notion connections, and sprints.
              </p>
            </div>
            <ModalFooter
              primaryText="Delete"
              primaryVariation={ButtonColour.Danger}
              clickPrimary={() => deleteTeam(team.id)}
              clickSecondary={setClose}
              secondaryText="Cancel"
            />
          </>
        )}
      />
    </Content>
  );
};
