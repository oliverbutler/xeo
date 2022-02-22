import { SprintHistory, SprintStatusHistory } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

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
  const userId = session.id;

  if (req.method === 'GET') {
    const sprintHistory = await prisma.sprintHistory.findMany({
      where: {
        sprint: {
          id: sprintId,
          backlog: {
            members: {
              some: {
                user: {
                  id: userId,
                },
              },
            },
          },
        },
      },
      include: {
        sprintStatusHistory: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!sprintHistory) {
      return apiError(res, { message: 'Sprint not found' }, 404);
    }

    return apiResponse<GetSprintHistory>(res, { sprintHistory });
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

export default withSentry(handler);
