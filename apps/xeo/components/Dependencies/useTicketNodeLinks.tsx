import { PostRemoveNotionTicketLink } from 'pages/api/team/[teamId]/dependencies/remove-link';
import { PostCreateNotionTicketLink } from 'pages/api/team/[teamId]/dependencies/update-link';
import { toast } from 'react-toastify';
import { apiPost } from 'utils/api';

interface Output {
  linkTickets: (childId: string, parentId: string) => Promise<void>;
  unlinkTickets: (childId: string, parentId: string) => Promise<void>;
}

export const useTicketNodeLinks = (
  teamId: string | null | undefined,
  sprintId: string | null | undefined
): Output => {
  const linkTickets = async (childId: string, parentId: string) => {
    if (!teamId || !sprintId) {
      toast.warn('Issue linking tickets, please reload.');
      return;
    }

    const { error } = await apiPost<PostCreateNotionTicketLink>(
      `/api/team/${teamId}/dependencies/update-link`,
      { sourceTicketId: childId, targetTicketId: parentId }
    );

    if (error) {
      toast.error(error.body?.message ?? error.generic);
    }
  };

  const unlinkTickets = async (childId: string, parentId: string) => {
    if (!teamId || !sprintId) {
      toast.warn('Issue linking tickets, please reload.');
      return;
    }

    const { error } = await apiPost<PostRemoveNotionTicketLink>(
      `/api/team/${teamId}/dependencies/remove-link`,
      { sourceTicketId: childId, targetTicketId: parentId }
    );

    if (error) {
      toast.error(error.body?.message ?? error.generic);
    }
  };

  return { linkTickets, unlinkTickets };
};
