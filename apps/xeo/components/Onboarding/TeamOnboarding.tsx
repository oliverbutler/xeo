import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Modal, ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { Footer } from 'components/Footer/Footer';
import { CreateTeamForm } from 'components/Team/CreateTeamForm';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { trackAction, UserAction } from 'utils/analytics';

export const TeamOnboarding: React.FunctionComponent = () => {
  const { me } = useCurrentUser();

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-dark-100 dark:bg-dark-900 rounded-lg m-10 shadow-xl transition-all hover:shadow-2xl">
          <div className="p-6">
            <h1>Hey {me?.metadata?.preferredName}, welcome to Xeo!</h1>
            <p>
              Let's get you started, first we've got to get you into your{' '}
              <b>first team</b>!
            </p>
            <div className="space-y-4">
              <h2>For a team member</h2>
              <p>
                Ask your leader to invite you, <code>{me?.email}</code>, to the
                team
              </p>
              <h2 className="pt-6">For a team leader</h2>
              <Modal
                mainText="Create Team"
                trigger={(setOpen) => (
                  <Button
                    onClick={() => {
                      trackAction(UserAction.CLICK_CREATE_TEAM);
                      setOpen();
                    }}
                    colour={ButtonColour.Dark}
                  >
                    Create a Team
                  </Button>
                )}
                content={(setClose) => (
                  <CreateTeamForm closeModal={setClose} setAsDefault />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
