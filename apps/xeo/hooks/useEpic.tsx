import { PostCreateNotionEpicRequest } from 'pages/api/team/[teamId]/epic';
import {
  DeleteNotionEpicRequest,
  PutUpdateNotionEpicRequest,
} from 'pages/api/team/[teamId]/epic/[epicId]';
import { toast } from 'react-toastify';
import { apiDelete, apiPost, apiPut } from 'utils/api';
import { UpdateNotionEpic } from 'utils/db/epic/adapter';
import { useCurrentTeam } from './useCurrentTeam';

export const useEpic = () => {
  const { team, refetchCurrentTeam } = useCurrentTeam();

  const createEpic = async ({
    notionEpicName,
    notionEpicId,
    notionEpicIcon,
  }: {
    notionEpicName: string;
    notionEpicId: string;
    notionEpicIcon: string | null;
  }) => {
    const result = await apiPost<PostCreateNotionEpicRequest>(
      `/api/team/${team?.id}/epic`,
      {
        input: {
          notionEpicName,
          notionEpicId,
          notionEpicIcon,
        },
      }
    );

    if (result.error) {
      toast.error(result.error.body?.message || result.error.generic);
      return;
    }

    toast.success('Epic added');
    refetchCurrentTeam();
  };

  const deleteEpic = async (epicId: string) => {
    const result = await apiDelete<DeleteNotionEpicRequest>(`
      /api/team/${team?.id}/epic/${epicId}
    `);

    if (result.error) {
      toast.error(result.error.body?.message || result.error.generic);
      return;
    }

    toast.success('Epic deleted');
    refetchCurrentTeam();
  };

  const updateEpic = async (epicId: string, input: UpdateNotionEpic) => {
    const result = await apiPut<PutUpdateNotionEpicRequest>(
      `
      /api/team/${team?.id}/epic/${epicId}
    `,
      { input }
    );

    if (result.error) {
      toast.error(result.error.body?.message || result.error.generic);
      return;
    }

    toast.success('Epic updated');
    refetchCurrentTeam();
  };

  return {
    createEpic,
    deleteEpic,
    updateEpic,
  };
};
