/* eslint-disable no-case-declarations */
import { Backlog, BacklogRole, NotionStatusLink } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
import { withSentry } from '@sentry/nextjs';

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

export type GetBacklogsRequest = {
  method: 'GET';
  responseBody: {
    backlogs: BacklogWithNotionStatusLinksAndOwner[];
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = session.id;

  if (req.method === 'GET') {
    const backlogs = await prisma.backlog.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
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

    const returnValue: GetBacklogsRequest['responseBody'] = {
      backlogs,
    };
    return res.status(200).json(returnValue);
  }

  return res.status(400).json({ message: 'Invalid request method' });
};

export default withSentry(handler);
