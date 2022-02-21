import { NotionConnection } from '@prisma/client';
import { Button, ButtonVariation, Modal, ModalFooter } from '@xeo/ui';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface Props {
  connection: NotionConnection;
}

export const DeleteNotionConnection: React.FunctionComponent<Props> = ({
  connection,
}) => {
  const deleteConnection = async (callback: () => void) => {
    await axios
      .delete(`/api/connections/${connection.id}/notion/databases`)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Notion Connection Deleted!');
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
        <Button onClick={setOpen} variation={ButtonVariation.Danger}>
          Delete
        </Button>
      )}
      content={(setClosed) => (
        <>
          <div className="m-5 flex max-w-none flex-col items-center justify-center text-center">
            <h2>
              Delete <i>{connection.notionWorkspaceName}</i>?
            </h2>
            <p>
              This action is irreversible and will delete all associated
              backlogs, and sprints.
            </p>
          </div>
          <ModalFooter
            primaryText="Delete"
            primaryVariation={ButtonVariation.Danger}
            clickPrimary={() => deleteConnection(setClosed)}
            clickSecondary={setClosed}
            secondaryText="Cancel"
          />
        </>
      )}
    />
  );
};
