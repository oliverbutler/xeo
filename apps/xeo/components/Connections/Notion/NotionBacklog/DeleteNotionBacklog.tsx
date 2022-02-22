import { Button, ButtonVariation, Modal, ModalFooter } from '@xeo/ui';
import { useBacklog } from 'components/Backlog/useBacklog';
import { BacklogWithMembersAndRestrictedUsers } from 'pages/api/backlog/[id]';

interface Props {
  backlog: BacklogWithMembersAndRestrictedUsers;
}

export const DeleteNotionBacklog: React.FunctionComponent<Props> = ({
  backlog,
}) => {
  const { deleteBacklog } = useBacklog();

  const handleDeleteBacklog = async (callback: () => void) => {
    const result = await deleteBacklog(backlog.id);

    if (result) {
      callback();
    }
  };

  return (
    <Modal
      mainText="Delete"
      trigger={(setOpen) => (
        <Button variation={ButtonVariation.Danger} onClick={setOpen}>
          Delete
        </Button>
      )}
      content={(setClosed) => (
        <>
          <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
            <h2>Delete Backlog?</h2>
            <p>
              This action is irreversible and will delete all associated
              sprints!
            </p>
          </div>
          <ModalFooter
            primaryText="Delete"
            primaryVariation={ButtonVariation.Danger}
            clickPrimary={() => handleDeleteBacklog(setClosed)}
            clickSecondary={setClosed}
            secondaryText="Cancel"
          />
        </>
      )}
    />
  );
};
