import { TrashIcon } from '@heroicons/react/outline';
import { ButtonVariation, Clickable, Modal, ModalFooter } from '@xeo/ui';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface Props {
  backlogId: string;
}

export const DeleteNotionBacklog: React.FunctionComponent<Props> = ({
  backlogId,
}) => {
  const deleteBacklog = async (callback: () => void) => {
    await axios
      .delete(`/api/backlog/${backlogId}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Notion Backlog Deleted!');
          mutate('/api/connections');
          callback();
        }
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <Modal
      mainText="Delete"
      trigger={(setOpen) => (
        <Clickable onClick={setOpen}>
          <TrashIcon width={25} height={25} />
        </Clickable>
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
            clickPrimary={() => deleteBacklog(setClosed)}
            clickSecondary={setClosed}
            secondaryText="Cancel"
          />
        </>
      )}
    />
  );
};
