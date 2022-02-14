import { Backlog, MemberOfBacklog } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';

export type GetBacklogRequest = APIGetRequest<{
  backlog: Backlog & {
    members: (MemberOfBacklog & {
      user: {
        id: string;
        image: string | null;
        email: string | null;
        name: string | null;
      };
    })[];
  };
}>;

export default async function backlog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  const backlogId = req.query.id as string;

  const backlog = await prisma.backlog.findFirst({
    where: {
      notionConnection: {
        createdByUserId: userId,
      },
      id: backlogId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              image: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!backlog) {
    return apiError(res, { message: 'Backlog not found' }, 404);
  }

  if (req.method === 'GET') {
    return apiResponse<GetBacklogRequest>(res, { backlog });
  } else if (req.method === 'DELETE') {
    try {
      await prisma.backlog.delete({
        where: {
          id: backlogId,
        },
      });

      return apiResponse(res, { message: 'Backlog deleted' });
    } catch (error) {
      return apiError(res, { message: 'Error deleting backlog' }, 500);
    }
  }
  return apiError(res, { message: 'Method not allowed' }, 405);
}
