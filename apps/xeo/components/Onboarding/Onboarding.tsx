import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { NotionConnection } from 'components/Connections/Notion/NotionConnection/NotionConnection';
import { trackAction, UserAction } from 'utils/analytics';

export const Onboarding: React.FunctionComponent = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <div className="rounded-lg shadow-lg bg-white dark:bg-dark-900 col-span-2 p-6">
        <h1>1) Join a Team</h1>
        <p>If you team already uses Xeo ask to get invited!</p>
        <p>
          You should be able to provide your email, and they should be able to
          quickly add you
        </p>
      </div>
      <div className="rounded-lg shadow-lg bg-white dark:bg-dark-900 col-span-2 p-6">
        <h1>2) Create a Team</h1>
        <p>
          If you are the Project Manager, Lead Developer or your team leader,
          feel free to connect to Notion to make a new Xeo Team!
        </p>
        <Modal
          mainText="Create Team"
          trigger={(setOpen) => (
            <Button
              onClick={() => {
                trackAction(UserAction.CLICK_CREATE_TEAM);
                setOpen();
              }}
              variation={ButtonVariation.Primary}
            >
              Create a Team
            </Button>
          )}
          content={(setClose) => <NotionConnection closeModal={setClose} />}
        />
      </div>
    </div>
  );
};
