import { Team } from '@prisma/client';
import { Button } from '@xeo/ui/lib/Button/Button';
import Input from '@xeo/ui/lib/Input/Input';
import { PutUpdateTeamRequest } from 'pages/api/team/[teamId]';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiPut } from 'utils/api';

interface Props {
  team: Team;
}

type BasicTeamInfoForm = {
  name: string;
  shortName: string;
  companyName: string;
};

export const BasicTeamInfoForm: React.FunctionComponent<Props> = ({ team }) => {
  const { register, handleSubmit } = useForm<BasicTeamInfoForm>({
    defaultValues: {
      name: team.name,
      shortName: team.shortName,
      companyName: team.companyName,
    },
  });

  const onSubmit = async (values: BasicTeamInfoForm) => {
    const { error } = await apiPut<PutUpdateTeamRequest>(
      `/api/team/${team.id}`,
      {
        input: values,
      }
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
      return;
    }

    toast.success('Team updated');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...register('name')} />
      <Input label="Short Name" {...register('shortName')} />
      <Input label="Company" {...register('companyName')} />
      <Button type="submit">Save</Button>
    </form>
  );
};
