import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import { getAllTicketsInSprint, Ticket } from 'utils/notion/backlog';
import { getSprintForTeam } from 'utils/db/sprint/adapter';

export type GetSprintTickets = APIGetRequest<{
  tickets: Ticket[];
}>;

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

  // Check the sprint exists for the team
  const sprint = await getSprintForTeam(sprintId, teamId);

  if (!sprint) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, sprintId);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprintId: string
) => {
  const tickets = await getAllTicketsInSprint(sprintId);

  return apiResponse(res, { tickets });
};

export default handler;
