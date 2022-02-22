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
}

export const useBacklog = (): Output => {
  const { data } = useSession();
  const userId = data?.id;

  const leaveBacklog = async (backlogId: string) => {
    return userId ? deleteMember(backlogId, userId) : undefined;
  };

  const deleteMember = async (backlogId: string, memberId: string) => {
    const result = await apiDelete<DeleteBacklogMember>(
      `/api/backlog/${backlogId}/members/${memberId}`
    );

    if (result.genericError) {
      toast.error(result.error?.message || result.genericError);
    } else {
      toast.success('Member deleted');
      mutate(`/api/backlog`);
    }
  };

  const addMember = async (backlogId: string, userId: string) => {
    const result = await apiPut<PutCreateBacklogMember>(
      `/api/backlog/${backlogId}/members`,
      { userId }
    );

    if (result.genericError) {
      toast.error(result.error?.message || result.genericError);
    } else {
      toast.success('Member added');
      mutate(`/api/backlog/${backlogId}`);
    }
  };

  return { deleteMember, leaveBacklog, addMember };
};
