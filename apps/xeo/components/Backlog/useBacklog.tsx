import { useSession } from 'next-auth/react';
import { PutCreateBacklogMember } from 'pages/api/backlog/[id]/members';
import { DeleteBacklogMember } from 'pages/api/backlog/[id]/members/[memberId]';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiDelete, apiPut } from 'utils/api';

interface Output {
  leaveBacklog: (backlogId: string) => Promise<void>;
  deleteMember: (backlogId: string, memberId: string) => Promise<void>;
  addMember: (backlogId: string, userId: string) => Promise<void>;
  deleteBacklog: (backlogId: string) => Promise<boolean>;
}

export const useBacklog = (): Output => {
  const { data } = useSession();
  const userId = data?.id;

  const leaveBacklog = async (backlogId: string) => {
    return userId ? deleteMember(backlogId, userId) : undefined;
  };

  const deleteMember = async (backlogId: string, memberId: string) => {
    const { error } = await apiDelete<DeleteBacklogMember>(
      `/api/backlog/${backlogId}/members/${memberId}`
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
    } else {
      toast.success('Member deleted');
      mutate(`/api/backlog`);
    }
  };

  const addMember = async (backlogId: string, userId: string) => {
    const { error } = await apiPut<PutCreateBacklogMember>(
      `/api/backlog/${backlogId}/members`,
      { userId }
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
    } else {
      toast.success('Member added');
      mutate(`/api/backlog/${backlogId}`);
    }
  };

  const deleteBacklog = async (backlogId: string) => {
    const { error } = await apiDelete<DeleteBacklogMember>(
      `/api/backlog/${backlogId}`
    );

    if (error) {
      toast.error(error.body?.message || error.generic);
      return false;
    }

    toast.success('Backlog deleted');
    mutate('/api/connections');
    return true;
  };

  return { deleteMember, leaveBacklog, addMember, deleteBacklog };
};
