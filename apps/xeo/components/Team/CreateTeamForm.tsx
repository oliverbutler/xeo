import Input from '@xeo/ui/lib/Input/Input';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useTeam } from 'hooks/useTeam';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface Props {
  closeModal: () => void;
  setAsDefault?: boolean;
}

type TeamCreationForm = {
  name: string;
  shortName: string;
  companyName: string;
};

export const CreateTeamForm: React.FunctionComponent<Props> = ({
  closeModal,
  setAsDefault,
}) => {
  const { createTeam } = useTeam();
  const { updateUserMetadata } = useCurrentUser();
  const router = useRouter();

  const { handleSubmit, register } = useForm<TeamCreationForm>();

  const onSubmit = async (values: TeamCreationForm) => {
    const team = await createTeam(values);

    if (team) {
      toast.success('Team created');
      closeModal();

      if (setAsDefault) {
        await updateUserMetadata({ defaultTeamId: team.id });
      }

      mutate('/api/user/me');
      mutate('/api/team');
      router.push(`/team/${team.id}`);
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
