import {
  Backlog,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
} from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { prisma } from 'utils/db';
import { createSprint, CreateSprint } from 'utils/sprint/adapter';
import { getDataForSprintChart } from 'utils/sprint/chart';
import { SprintWithPlotData } from 'utils/sprint/utils';
import { withSentry } from '@sentry/nextjs';

export type SprintWithHistory = Sprint & {
  sprintHistory: (SprintHistory & {
    sprintStatusHistory: SprintStatusHistory[];
  })[];
};

export type GetSprintsRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    backlogs: {
      backlog: Backlog;
      sprints: SprintWithPlotData[];
    }[];
  };
};

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
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  if (req.method === 'GET') {
    // All Backlogs a user has access to
    const backlogs = await prisma.backlog.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
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

    const backlogsUserCanAccess = backlogs.map(
      ({ sprints, ...backlogWithoutSprints }) => {
        const sprintsWithPlotData = sprints.map((sprint) => ({
          sprint,
          plotData: getDataForSprintChart(
            sprint,
            sprint.sprintHistory,
            backlogWithoutSprints.notionStatusLinks
          ),
        }));

        return {
          backlog: backlogWithoutSprints,
          sprints: sprintsWithPlotData,
        };
      }
    );

    const returnValue: GetSprintsRequest['responseBody'] = {
      backlogs: backlogsUserCanAccess,
    };
    return res.status(200).json(returnValue);
  } else if (req.method === 'POST') {
    const { body: bodyPost, error: errorPost } = parseAPIRequest(
      req,
      postSchema
    );

    if (errorPost || !bodyPost) {
      return res.status(400).json({ message: errorPost?.message });
    }

    const backlog = await prisma.backlog.findUnique({
      where: {
        id: bodyPost.backlogId,
      },
    });

    if (!backlog) {
      return res.status(400).json({ message: 'Backlog not found' });
    }

    console.log(userId, backlog, bodyPost);

    const createdSprint = await createSprint(
      userId,
      backlog.id,
      bodyPost.input
    );

    const postReturn: PostCreateSprintRequest['response'] = {
      sprint: createdSprint,
    };

    return res.status(200).json(postReturn);
  }
  return res.status(400).json({ message: 'Invalid request method' });
};

export default withSentry(handler);
