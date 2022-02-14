import { MemberOfBacklog } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db';

export type PutCreateBacklogMember = APIRequest<
  {
    userId: string;
  },
  {
    message: string;
    member: MemberOfBacklog;
  }
>;

const schema: PutCreateBacklogMember['joiBodySchema'] = Joi.object({
  userId: Joi.string().required(),
});

export default async function backlogMembers(
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

  if (req.method === 'PUT') {
    const { body, error } = parseAPIRequest(req, schema);

    if (error || !body) {
      return res.status(400).json({ message: error?.message });
    }

    try {
      const member = await prisma.memberOfBacklog.create({
        data: {
          userId: body.userId,
          backlogId: backlogId,
        },
      });

      const returnData: PutCreateBacklogMember['response'] = {
        message: 'Member added',
        member,
      };

      return res.status(200).json(returnData);
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'User already member of backlog' });
    }
  }
  return res.status(400).json({ message: 'Invalid request method' });
}
