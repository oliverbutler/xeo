import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal, ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { UserAction, trackSprintAction } from 'utils/analytics';

interface Props {
  sprintId: string;
}

export const DeleteSprint: React.FunctionComponent<Props> = ({ sprintId }) => {
  const router = useRouter();

  const deleteSprint = async (callback: () => void) => {
    trackSprintAction({ action: UserAction.SPRINT_DELETE, sprintId: sprintId });
    await axios
      .delete(`/api/sprint/${sprintId}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Sprint Deleted!');
          mutate(`/api/sprint`);
          callback();
          router.push('/');
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
        <Button onClick={setOpen} variation={ButtonVariation.Danger}>
          Delete Sprint
        </Button>
      )}
      content={(setClosed) => (
        <>
          <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
            <h2>Delete Sprint?</h2>
            <p>
              This action is irreversible and will delete all Sprint history.
            </p>
          </div>
          <ModalFooter
            primaryText="Delete"
            primaryVariation={ButtonVariation.Danger}
            clickPrimary={() => deleteSprint(setClosed)}
            clickSecondary={setClosed}
            secondaryText="Cancel"
          />
        </>
      )}
    />
  );
};
