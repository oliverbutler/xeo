/* eslint-disable no-case-declarations */
import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db';
import { createSprint, CreateSprint } from 'utils/sprint/adapter';
import { DataPlotType, getDataForSprintChart } from 'utils/sprint/chart';

export type GetSprintsRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    sprints: {
      sprint: Sprint;
      plotData: DataPlotType[];
    }[];
  };
};

export type PostCreateSprintRequest = APIRequest<
  { input: CreateSprint },
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
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
});

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
  const userId = session?.user?.id as string;

  const backlogAndSprints = await prisma.backlog.findFirst({
    where: {
      userId: session.id as string,
    },
    include: {
      sprints: {
        include: {
          sprintHistory: {
            include: {
              sprintStatusHistory: true,
            },
          },
        },
      },
      notionStatusLinks: true,
    },
  });

  if (!backlogAndSprints) {
    return res
      .status(404)
      .json({ message: 'Backlog not found for your account' });
  }

  switch (req.method) {
    case 'GET':
      const sprints = backlogAndSprints.sprints.map((sprint) => ({
        sprint,
        plotData: getDataForSprintChart(
          sprint,
          sprint.sprintHistory,
          backlogAndSprints.notionStatusLinks
        ),
      }));

      const returnValue: GetSprintsRequest['responseBody'] = {
        sprints,
      };

      return res.status(200).json(returnValue);

    case 'POST':
      const { body: bodyPost, error: errorPost } = parseAPIRequest(
        req,
        postSchema
      );

      if (errorPost) {
        return res.status(400).json({ message: errorPost.message });
      }

      const createdSprint = await createSprint(
        backlogAndSprints.userId,
        backlogAndSprints.id,
        bodyPost.input
      );

      const postReturn: PostCreateSprintRequest['response'] = {
        sprint: createdSprint,
      };

      return res.status(200).json(postReturn);

    default:
      return res.status(400).json({ message: 'Invalid request method' });
  }
}
