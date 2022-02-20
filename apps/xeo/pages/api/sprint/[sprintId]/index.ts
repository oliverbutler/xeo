/* eslint-disable no-case-declarations */
import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db';
import { updateSprint, UpdateSprint } from 'utils/sprint/adapter';
import { withSentry } from '@sentry/nextjs';

export type GetSprintRequest = {
  requestBody: undefined;
  responseBody: {
    sprint: Sprint;
  };
};

export type PutUpdateSprintRequest = APIRequest<
  { input: UpdateSprint },
  {
    sprint: Sprint;
  }
>;

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
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = session.id;

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: req.query.sprintId as string,
      backlog: {
        members: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
    },
  });

  if (!sprint) {
    return res.status(404).json({ message: 'Sprint not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ sprint });
  } else if (req.method === 'PUT') {
    const { body, error } = parseAPIRequest(req, putSchema);

    if (error || !body) {
      return res.status(400).json({ message: error?.message });
    }

    const updatedSprint = await updateSprint(
      req.query.sprintId as string,
      body.input
    );

    return res.status(200).json({ updatedSprint });
  } else if (req.method === 'DELETE') {
    await prisma.sprint.delete({
      where: {
        id: sprint.id,
      },
    });

    return res.status(200).json({ message: 'Sprint deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default withSentry(handler);
