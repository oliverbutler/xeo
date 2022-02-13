import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { fetchAvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { prisma } from 'utils/db';

export default async function backlog(
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

  const backlogId = req.query.id as string;

  if (req.method === 'DELETE') {
    const backlog = await prisma.backlog.findFirst({
      where: {
        notionConnection: {
          createdByUserId: userId,
        },
        id: backlogId,
      },
    });

    if (!backlog) {
      return res.status(404).json({ message: 'Backlog not found' });
    }

    try {
      await prisma.backlog.delete({
        where: {
          id: backlogId,
        },
      });

      return res.status(200).json({ message: 'Backlog deleted' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting Backlog',
      });
    }
  }
  return res.status(400).json({ message: 'Invalid request method' });
}
