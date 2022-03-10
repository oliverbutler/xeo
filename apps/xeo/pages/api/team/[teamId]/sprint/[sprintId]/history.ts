import { SprintHistory, SprintStatusHistory } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import { getSprintWithHistory } from 'utils/db/sprint/adapter';

export type GetSprintHistory = APIGetRequest<{
  sprintHistory: SprintHistoryWithStatus[];
}>;

export type SprintHistoryWithStatus = SprintHistory & {
  sprintStatusHistory: SprintStatusHistory[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const sprintId = req.query.sprintId as string;
  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, teamId, sprintId);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  sprintId: string
) => {
  const sprintWithHistory = await getSprintWithHistory(sprintId, teamId);

  if (!sprintWithHistory) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  return apiResponse(res, { sprintHistory: sprintWithHistory.sprintHistory });
};

export default handler;
