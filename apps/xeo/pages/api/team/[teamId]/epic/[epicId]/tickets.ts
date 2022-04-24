import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import { getAllTicketsInEpic, Ticket } from 'utils/notion/backlog';
import { getNotionEpicForTeam } from 'utils/db/epic/adapter';

export type GetNotionEpicTickets = APIGetRequest<{
  tickets: Ticket[];
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const epicId = req.query.epicId as string;
  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  // Check the team has an epic with that ID
  const epic = await getNotionEpicForTeam(epicId, teamId);

  if (!epic) {
    return apiError(res, { message: 'Epic not found' }, 404);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, epicId);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  epicId: string
) => {
  const tickets = await getAllTicketsInEpic(epicId);

  return apiResponse(res, { tickets });
};

export default handler;
