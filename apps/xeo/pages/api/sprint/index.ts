import {
  Backlog,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
} from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { prisma } from 'utils/db';
import { createSprint, CreateSprint } from 'utils/sprint/adapter';

import { TIME_REGEX } from './[sprintId]';

export type SprintWithHistory = Sprint & {
  sprintHistory: (SprintHistory & {
    sprintStatusHistory: SprintStatusHistory[];
  })[];
};

export type GetSprintsRequest = APIGetRequest<{
  backlogs: {
    backlog: Backlog;
    sprints: Sprint[];
  }[];
}>;

export type PostCreateSprintRequest = APIRequest<
  { input: CreateSprint; backlogId: string },
  {
    sprint: Sprint;
  }
>;

const postSchema: PostCreateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string().required(),
    goal: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notionSprintValue: Joi.string().required(),
    teamSpeed: Joi.number().required(),
    dayStartTime: Joi.string().regex(TIME_REGEX).required(),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
  backlogId: Joi.string().required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  if (req.method === 'GET') {
    // All Backlogs a user has access to
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
        sprints: true,
      },
    });

    const backlogsUserCanAccess = backlogs.map(
      ({ sprints, ...backlogWithoutSprints }) => {
        return {
          backlog: backlogWithoutSprints,
          sprints: sprints,
        };
      }
    );

    return apiResponse<GetSprintsRequest>(res, {
      backlogs: backlogsUserCanAccess,
    });
  } else if (req.method === 'POST') {
    const { body: bodyPost, error: errorPost } = parseAPIRequest(
      req,
      postSchema
    );

    if (errorPost || !bodyPost) {
      return apiError(res, { message: errorPost?.message ?? '' }, 400);
    }

    const backlog = await prisma.backlog.findUnique({
      where: {
        id: bodyPost.backlogId,
      },
    });

    if (!backlog) {
      return apiError(res, { message: 'Backlog not found' }, 404);
    }

    console.log(userId, backlog, bodyPost);

    const createdSprint = await createSprint(
      userId,
      backlog.id,
      bodyPost.input
    );

    return apiResponse<PostCreateSprintRequest>(res, {
      sprint: createdSprint,
    });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
