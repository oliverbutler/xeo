import { Team } from '@prisma/client';
import { CreateTeamRequest } from 'pages/api/team';
import { toast } from 'react-toastify';
import { apiGet, apiPost } from 'utils/api';
import { CreateTeam } from 'utils/db/team/adapter';

interface Output {
  createTeam: (input: CreateTeam) => Promise<Team | undefined>;
}

export const useTeam = (): Output => {
  const createTeam = async (input: CreateTeam): Promise<Team | undefined> => {
    const { data, error } = await apiPost<CreateTeamRequest>('/api/team', {
      input,
    });

    if (error) {
      toast.error(error.body?.message ?? error.generic);
      return undefined;
    }

    return data?.team;
  };

  return { createTeam };
};
