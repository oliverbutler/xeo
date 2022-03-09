import Input from '@xeo/ui/lib/Input/Input';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { useTeam } from 'hooks/useTeam';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  closeModal: () => void;
}

type TeamCreationForm = {
  name: string;
  shortName: string;
  companyName: string;
};

export const NotionConnection: React.FunctionComponent<Props> = ({
  closeModal,
}) => {
  const { createTeam } = useTeam();

  const { handleSubmit, register } = useForm<TeamCreationForm>();

  const onSubmit = async (values: TeamCreationForm) => {
    const team = await createTeam(values);

    if (team) {
      toast.success('Team created');
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-10 mb-10 flex flex-col">
        <h2 className="text-center">Create a Team</h2>
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="The Best Team"
            {...register('name')}
          />
          <Input
            label="Short Team Name"
            placeholder="TBT"
            {...register('shortName')}
          />
          <Input
            label="Company Name"
            placeholder="My Awesome Company"
            {...register('companyName')}
          />
        </div>
      </div>
      <ModalFooter className="w-full" primaryText={`Create Team`} />
    </form>
  );
};
