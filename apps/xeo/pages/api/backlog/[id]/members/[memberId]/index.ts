import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIDeleteRequest } from 'utils/api';
import { prisma } from 'utils/db';
import { withSentry } from '@sentry/nextjs';

export type DeleteBacklogMember = APIDeleteRequest<{
  message: string;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  const backlogId = req.query.id as string;
  const memberId = req.query.memberId as string;

  // Get the backlog and check if the user is allowed to access it
  const backlog = await prisma.backlog.findFirst({
    where: { id: backlogId, notionConnection: { createdByUserId: userId } },
    include: {
      members: {
        select: {
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
      notionConnection: true,
    },
  });

  if (!backlog) {
    return res.status(404).json({ message: 'Backlog not found' });
  }

  if (backlog.notionConnection.createdByUserId !== userId) {
    return res
      .status(403)
      .json({ message: "You don't have permission to access this backlog" });
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.memberOfBacklog.delete({
        where: { userId_backlogId: { userId: memberId, backlogId } },
      });

      return res.status(200).json({ message: 'Member deleted' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting Member',
      });
    }
  }
  return res.status(400).json({ message: 'Invalid request method' });
};

export default withSentry(handler);
