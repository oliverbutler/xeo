import { Team, TeamRole } from '@prisma/client';
import { CreateTeamRequest } from 'pages/api/team';
import { DeleteTeamRequest } from 'pages/api/team/[teamId]';
import { PostCreateTeamMember } from 'pages/api/team/[teamId]/members';
import {
  DeleteTeamMember,
  UpdateTeamMember,
} from 'pages/api/team/[teamId]/members/[memberId]';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiDelete, apiPost, apiPut } from 'utils/api';
import { CreateTeam } from 'utils/db/team/adapter';
import { useCurrentUser } from './useCurrentUser';

interface Output {
  createTeam: (input: CreateTeam) => Promise<Team | undefined>;
  deleteMember: (teamId: string, memberId: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  addMember: (teamId: string, userId: string) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<boolean>;
  updateMember: (
    teamId: string,
    userId: string,
    role: TeamRole
  ) => Promise<void>;
}

export const useTeam = (): Output => {
  const { me } = useCurrentUser();

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

  const deleteMember = async (teamId: string, memberId: string) => {
    const { error } = await apiDelete<DeleteTeamMember>(
      `/api/team/${teamId}/members/${memberId}`
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
    } else {
      toast.success('Member deleted');
      mutate(`/api/team/${teamId}`);
    }
  };

  const leaveTeam = async (teamId: string) => {
    return me?.id ? deleteMember(teamId, me.id) : undefined;
  };

  const addMember = async (teamId: string, userId: string) => {
    const { error } = await apiPost<PostCreateTeamMember>(
      `/api/team/${teamId}/members`,
      { userId }
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
    } else {
      toast.success('Member added');
      mutate(`/api/team/${teamId}`);
    }
  };

  const deleteTeam = async (teamId: string) => {
    const { error } = await apiDelete<DeleteTeamRequest>(`/api/team/${teamId}`);

    if (error) {
      toast.error(error.body?.message || error.generic);
      return false;
    }

    toast.success('Team deleted');
    return true;
  };

  const updateMember = async (
    teamId: string,
    userId: string,
    role: TeamRole
  ) => {
    const { data, error } = await apiPut<UpdateTeamMember>(
      `/api/team/${teamId}/members/${userId}`,
      { role }
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
      return;
    }

    toast.success(data?.message);
    mutate(`/api/team/${teamId}`);
  };

  return {
    createTeam,
    deleteMember,
    leaveTeam,
    addMember,
    deleteTeam,
    updateMember,
  };
};
