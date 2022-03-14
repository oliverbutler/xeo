import { NotionColumnType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

import { getAvailableColumnOptions } from 'utils/notion/backlog';

export type GetTeamDatabaseSprintOptions = APIGetRequest<{
  type: NotionColumnType;
  options: { label: string; value: string }[];
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const teamId = req.query.teamId as string;
  const searchString = req.query.searchString as string;

  // Check user is in team
  const userRole = await getUserRoleInTeam(session.id, teamId);

  if (!userRole) {
    return apiError(res, { message: 'Not authorized' }, 403);
  }

  switch (req.method) {
    case 'GET':
      return getHandler(req, res, teamId, searchString);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  searchString: string
) => {
  const notionDatabaseWithAccessToken = await prisma.notionDatabase.findUnique({
    where: {
      teamId,
    },
    include: {
      notionConnection: {
        select: {
          accessToken: true,
        },
      },
    },
  });

  if (!notionDatabaseWithAccessToken) {
    return apiError(res, { message: 'Notion database not found' }, 400);
  }

  const availableColumnOptions = await getAvailableColumnOptions({
    accessToken: notionDatabaseWithAccessToken.notionConnection.accessToken,
    databaseId: notionDatabaseWithAccessToken.databaseId,
    columnName: notionDatabaseWithAccessToken.sprintColumnName,
    searchString: searchString || '',
  });

  return apiResponse<GetTeamDatabaseSprintOptions>(res, availableColumnOptions);
};
export default handler;
