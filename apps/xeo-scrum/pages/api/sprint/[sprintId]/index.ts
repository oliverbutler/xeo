/* eslint-disable no-case-declarations */
import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db';
import {
  createSprint,
  CreateSprint,
  updateSprint,
  UpdateSprint,
} from 'utils/sprint/adapter';

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

export type PostCreateSprintRequest = APIRequest<
  { input: CreateSprint },
  {
    sprint: Sprint;
  }
>;

const putSchema: PutUpdateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string(),
    goal: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    notionSprintValue: Joi.string(),
    teamSpeed: Joi.number(),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
});

const postSchema: PostCreateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string().required(),
    goal: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notionSprintValue: Joi.string().required(),
    teamSpeed: Joi.number().required(),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
});

export default async function getSprint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: req.query.sprintId as string,
    },
  });

  if (!sprint) {
    return res.status(404).json({ message: 'Sprint not found' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.user?.id as string;

  switch (req.method) {
    case 'GET':
      return res.status(200).json({ sprint });

    case 'PUT':
      const { body, error } = parseAPIRequest(req, putSchema);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const updatedSprint = await updateSprint(
        req.query.sprintId as string,
        body.input
      );

      return res.status(200).json({ updatedSprint });

    case 'POST':
      const { body: bodyPost, error: errorPost } = parseAPIRequest(
        req,
        postSchema
      );

      if (errorPost) {
        return res.status(400).json({ message: errorPost.message });
      }

      const createdSprint = await createSprint(
        userId,
        sprint.backlogId,
        bodyPost.input
      );

      const postReturn: PostCreateSprintRequest['response'] = {
        sprint: createdSprint,
      };

      return res.status(200).json(postReturn);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
