/* eslint-disable no-case-declarations */
import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  APIDeleteRequest,
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { prisma } from 'utils/db/db';
import { updateSprint, UpdateSprint } from 'utils/sprint/adapter';

export type GetSprintRequest = APIGetRequest<{
  sprint: Sprint;
}>;

export type PutUpdateSprintRequest = APIRequest<
  { input: UpdateSprint },
  {
    sprint: Sprint;
  }
>;

export type DeleteSprintRequest = APIDeleteRequest<{ message: string }>;

export const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const putSchema: PutUpdateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string(),
    goal: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    notionSprintValue: Joi.string(),
    teamSpeed: Joi.number(),
    dayStartTime: Joi.string().regex(TIME_REGEX),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: req.query.sprintId as string,
      backlog: {
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
    },
  });

  if (!sprint) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  if (req.method === 'GET') {
    return apiResponse<GetSprintRequest>(res, {
      sprint,
    });
  } else if (req.method === 'PUT') {
    const { body, error } = parseAPIRequest(req, putSchema);

    if (error || !body) {
      return apiError(res, { message: error?.message ?? '' }, 400);
    }

    const updatedSprint = await updateSprint(
      req.query.sprintId as string,
      body.input
    );

    return apiResponse<PutUpdateSprintRequest>(res, {
      sprint: updatedSprint,
    });
  } else if (req.method === 'DELETE') {
    await prisma.sprint.delete({
      where: {
        id: sprint.id,
      },
    });

    return apiResponse<DeleteSprintRequest>(res, {
      message: 'Sprint deleted',
    });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
