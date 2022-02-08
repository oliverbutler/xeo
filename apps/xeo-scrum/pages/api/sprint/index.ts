import { Sprint, SprintHistory, SprintStatusHistory } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
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

export default async function getSprints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

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

  const sprints = backlogAndSprints.sprints.map((sprint) => ({
    sprint,
    plotData: getDataForSprintChart(
      sprint.sprintHistory,
      backlogAndSprints.notionStatusLinks
    ),
  }));

  const returnValue: GetSprintsRequest['responseBody'] = {
    sprints,
  };

  return res.status(200).json(returnValue);
}
