import { NotionColumnType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';

import { getAvailableColumnOptions } from 'utils/notion/backlog';

export type GetBacklogSprintOptions = APIGetRequest<{
  type: NotionColumnType;
  options: { label: string; value: string }[];
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const callingUserId = session.id;
  const backlogId = req.query.id as string;

  if (!backlogId) {
    return apiError(res, { message: 'Missing required query parameters' });
  }

  const searchString = req.query.searchString as string | undefined;

  const backlog = await prisma.backlog.findFirst({
    where: {
      id: backlogId,
      OR: [
        {
          members: {
            some: {
              userId: callingUserId,
              backlogId: backlogId,
            },
          },
        },
        { notionConnection: { createdByUserId: callingUserId } },
      ],
    },
    include: {
      notionConnection: true,
    },
  });

  if (!backlog) {
    return apiError(res, { message: 'Backlog not found' }, 400);
  }

  if (req.method === 'GET') {
    const result = await getAvailableColumnOptions({
      accessToken: backlog.notionConnection.accessToken,
      databaseId: backlog.databaseId,
      columnName: backlog.sprintColumnName,
      searchString: searchString ?? '',
    });

    return apiResponse<GetBacklogSprintOptions>(res, result);
  }
  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
