import { BacklogRole, MemberOfBacklog } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db/db';

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
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
        { notionConnection: { createdByUserId: callingUserId } },
        {
          members: {
            some: {
              role: BacklogRole.ADMIN,
              userId: callingUserId,
              backlogId: backlogId,
            },
          },
        },
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
    },
  });

  if (!backlog) {
    return apiError(res, { message: 'Backlog not found' }, 400);
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
          role: BacklogRole.MEMBER,
        },
      });

      return apiResponse<PutCreateBacklogMember>(res, {
        message: 'Member added',
        member,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'User already member of backlog' });
    }
  }
  return res.status(400).json({ message: 'Invalid request method' });
};

export default handler;
