/* eslint-disable no-case-declarations */
import { Backlog, NotionStatusLink } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

export type BacklogWithNotionStatusLinks = Backlog & {
  notionStatusLinks: NotionStatusLink[];
};

export type GetBacklogsRequest = {
  method: 'GET';
  responseBody: {
    backlogs: BacklogWithNotionStatusLinks[];
  };
};

export default async function getSprints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  if (req.method === 'GET') {
    const backlogs = await prisma.backlog.findMany({
      where: {
        OR: [
          { userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        notionStatusLinks: true,
      },
    });

    const returnValue: GetBacklogsRequest['responseBody'] = {
      backlogs,
    };
    return res.status(200).json(returnValue);
  }

  return res.status(400).json({ message: 'Invalid request method' });
}
