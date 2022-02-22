import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  APIDeleteRequest,
  apiError,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { prisma } from 'utils/db';
import { withSentry } from '@sentry/nextjs';
import { BacklogRole } from '@prisma/client';
import Joi from 'joi';

export type DeleteBacklogMember = APIDeleteRequest<{
  message: string;
}>;

export type UpdateBacklogMember = APIRequest<
  { role: BacklogRole },
  { message: string }
>;

const putSchema: UpdateBacklogMember['joiBodySchema'] = Joi.object({
  role: Joi.string()
    .valid(...Object.values(BacklogRole))
    .required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const callingUserId = session.id as string;
  const backlogId = req.query.id as string;
  const memberId = req.query.memberId as string;

  if (!backlogId || !memberId) {
    return apiError(res, { message: 'Missing required query parameters' });
  }

  const callingMember = await prisma.memberOfBacklog.findUnique({
    where: {
      userId_backlogId: {
        userId: callingUserId,
        backlogId,
      },
    },
  });

  const backlog = await prisma.backlog.findUnique({
    where: {
      id: backlogId,
    },
    include: {
      notionConnection: true,
    },
  });

  if (!backlog) {
    return apiError(res, { message: 'Backlog not found' });
  }

  // If not a creator, and not a member of the backlog
  if (
    backlog.notionConnection.createdByUserId !== callingUserId &&
    !callingMember
  ) {
    return apiError(res, { message: 'Not a member of the backlog' });
  }

  if (req.method === 'PUT') {
    const { body, error } = parseAPIRequest(req, putSchema);

    if (error || !body) {
      return apiError(res, { message: error?.message }, 400);
    }

    if (callingMember?.role === BacklogRole.MEMBER) {
      return apiError(
        res,
        { message: 'You dont have permission to add backlog members' },
        400
      );
    }

    const updated = await prisma.memberOfBacklog.update({
      where: {
        userId_backlogId: {
          userId: memberId,
          backlogId,
        },
      },
      data: {
        role: body.role,
      },
      include: {
        user: true,
      },
    });

    return apiResponse<UpdateBacklogMember>(res, {
      message: `Updated ${updated.user.name}`,
    });
  } else if (req.method === 'DELETE') {
    const memberToDelete = await prisma.memberOfBacklog.findUnique({
      where: {
        userId_backlogId: { userId: memberId, backlogId },
      },
    });

    if (!memberToDelete) {
      return apiError(res, { message: 'Member not found' }, 404);
    }

    // MEMBER delete only themself
    if (
      callingMember?.role === BacklogRole.MEMBER &&
      memberToDelete.userId !== callingUserId
    ) {
      return apiError(
        res,
        {
          message:
            'As a member, you dont have permission to delete other members',
        },
        400
      );
    }

    await prisma.memberOfBacklog.delete({
      where: { userId_backlogId: { userId: memberId, backlogId } },
    });

    return apiResponse<DeleteBacklogMember>(res, {
      message: `Deleted Member`,
    });
  }
  return apiError(res, { message: 'Invalid method' }, 400);
};

export default withSentry(handler);
