import { NotionDatabase } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getNotionDatabase } from 'utils/db/notionDatabase/adapter';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

export type GetTeamNotionDatabase = APIGetRequest<{
  database: NotionDatabase;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;
  const teamId = req.query.teamId as string;

  const callingUserRole = await getUserRoleInTeam(userId, teamId);

  if (!callingUserRole) {
    return apiError(res, { message: 'Not authorized' }, 403);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, teamId, userId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userId: string
) => {
  const database = await getNotionDatabase(teamId);

  if (!database) {
    return apiError(
      res,
      { message: 'Your team has no database, connect to one!' },
      400
    );
  }

  return apiResponse<GetTeamNotionDatabase>(res, {
    database,
  });
};

export default handler;
