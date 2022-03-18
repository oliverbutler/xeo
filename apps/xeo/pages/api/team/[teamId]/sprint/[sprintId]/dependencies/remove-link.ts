import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import {
  getSprintForTeamWithDatabaseAndConnection,
  SprintWithTeamAndConnectionAndDatabase,
} from 'utils/db/sprint/adapter';
import Joi from 'joi';
import { removeLinkBetweenTickets } from 'utils/notion/ticket';

export type PostRemoveNotionTicketLink = APIRequest<
  {
    sourceTicketId: string;
    targetTicketId: string;
  },
  {
    success: boolean;
  }
>;

const putSchema: PostRemoveNotionTicketLink['joiBodySchema'] = Joi.object({
  sourceTicketId: Joi.string().required(),
  targetTicketId: Joi.string().required(),
});

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

  const sprint = await getSprintForTeamWithDatabaseAndConnection(
    sprintId,
    teamId
  );

  if (!sprint) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  switch (req.method) {
    case 'POST':
      return await postHandler(req, res, sprint);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprint: SprintWithTeamAndConnectionAndDatabase
) => {
  const { body, error } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  try {
    await removeLinkBetweenTickets(
      body.sourceTicketId,
      body.targetTicketId,
      sprint.team.notionDatabase,
      sprint.team.notionConnection
    );

    return apiResponse<PostRemoveNotionTicketLink>(res, { success: true });
  } catch (e) {
    return apiError(
      res,
      {
        message: 'Error removing link between these tickets, please try again',
      },
      400
    );
  }
};

export default handler;
