/* eslint-disable no-case-declarations */
import { Backlog, BacklogRole, NotionStatusLink } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

import { apiError, APIGetRequest, apiResponse } from 'utils/api';

export type UserRestricted = {
  id: string;
  image: string | null;
  email: string | null;
  name: string | null;
};

export type BacklogWithNotionStatusLinksAndOwner = Backlog & {
  notionStatusLinks: NotionStatusLink[];
  members: {
    role: BacklogRole;
    user: UserRestricted;
  }[];
  notionConnection: {
    notionWorkspaceName: string | null;
    createdByUser: UserRestricted;
  };
};

export type GetBacklogsRequest = APIGetRequest<{
  backlogs: BacklogWithNotionStatusLinksAndOwner[];
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  if (req.method === 'GET') {
    const backlogs = await prisma.backlog.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                userId,
              },
            },
          },
          { notionConnection: { createdByUserId: userId } },
        ],
      },
      include: {
        notionStatusLinks: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                image: true,
                email: true,
                name: true,
              },
            },
            role: true,
          },
        },
        notionConnection: {
          select: {
            notionWorkspaceName: true,
            createdByUser: {
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

    return apiResponse<GetBacklogsRequest>(res, {
      backlogs,
    });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
