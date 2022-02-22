import { Backlog, BacklogRole, MemberOfBacklog } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';
import { withSentry } from '@sentry/nextjs';

export type BacklogWithMembersAndRestrictedUsers = Backlog & {
  notionConnection: {
    createdByUserId: string;
  };
  members: (MemberOfBacklog & {
    user: {
      id: string;
      image: string | null;
      name: string | null;
      email: string | null;
    };
  })[];
};

export type GetBacklogRequest = APIGetRequest<{
  backlog: BacklogWithMembersAndRestrictedUsers;
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

  const backlog = await prisma.backlog.findFirst({
    where: {
      id: backlogId,
      OR: [
        {
          members: {
            some: {
              role: BacklogRole.ADMIN,
              userId: callingUserId,
              backlogId: backlogId,
            },
          },
        },
        { notionConnection: { createdByUserId: callingUserId } },
      ],
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              image: true,
              name: true,
              email: true,
            },
          },
        },
      },
      notionConnection: {
        select: {
          createdByUserId: true,
        },
      },
    },
  });

  if (!backlog) {
    return apiError(res, { message: 'Backlog not found' }, 400);
  }

  if (req.method === 'GET') {
    return apiResponse<GetBacklogRequest>(res, {
      backlog: backlog,
    });
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
};

export default withSentry(handler);
