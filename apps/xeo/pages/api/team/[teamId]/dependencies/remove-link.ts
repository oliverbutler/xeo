import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { getSession } from 'next-auth/react';
import {
  getTeamWithConnection,
  getUserRoleInTeam,
} from 'utils/db/team/adapter';
import {
  getSprintForTeamWithDatabaseAndConnection,
  SprintWithTeamAndConnectionAndDatabase,
} from 'utils/db/sprint/adapter';
import Joi from 'joi';
import { removeLinkBetweenTickets } from 'utils/notion/ticket';
import { NotionConnection, NotionDatabase } from '@prisma/client';

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

  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  const team = await getTeamWithConnection(teamId);

  if (!userRole || !team) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  if (!team.notionDatabase || !team.notionConnection) {
    return apiError(
      res,
      { message: 'Team does not have a Notion connection' },
      403
    );
  }
  switch (req.method) {
    case 'POST':
      return await postHandler(
        req,
        res,
        team.notionDatabase,
        team.notionConnection
      );
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  notionDatabase: NotionDatabase,
  notionConnection: NotionConnection
) => {
  const { body, error } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  try {
    await removeLinkBetweenTickets(
      body.sourceTicketId,
      body.targetTicketId,
      notionDatabase,
      notionConnection
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
