import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import {
  getNotionConnectionForTeam,
  NotionConnectionInformation,
} from 'utils/db/notionConnection/adapter';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

export type GetTeamNotionConnectionInformation = APIGetRequest<{
  notionConnection: NotionConnectionInformation;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const callingUserId = session.id;
  const teamId = req.query.teamId as string;

  if (!teamId) {
    return apiError(res, { message: 'Missing required query parameters' });
  }

  const callingUserRole = await getUserRoleInTeam(callingUserId, teamId);

  if (!callingUserRole) {
    return apiError(res, { message: 'User is not a member of the team' });
  }

  if (callingUserRole !== 'OWNER') {
    return apiError(res, {
      message: "User isn't an owner or admin of the team",
    });
  }

  switch (req.method) {
    case 'GET':
      return getHandler(req, res, teamId);
  }

  return res.status(400).json({ message: 'Invalid request method' });
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const notionConnection = await getNotionConnectionForTeam(teamId);

  if (!notionConnection) {
    return apiError(res, { message: 'Notion connection not found' });
  }

  return apiResponse<GetTeamNotionConnectionInformation>(res, {
    notionConnection,
  });
};

export default handler;
