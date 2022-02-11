import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { DataPlotType, getDataForSprintChart } from 'utils/sprint/chart';
import { prisma } from 'utils/db';

export type GetSprintHistoryRequest = {
  method: 'GET';
  responseBody: {
    sprint: Sprint;
    sprintHistoryPlotData: DataPlotType[];
  };
};

export default async function getSprintHistoryRequest(
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

  const sprintId = req.query.sprintId as string;

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
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
    include: {
      backlog: {
        include: {
          notionStatusLinks: true,
        },
      },
      sprintHistory: {
        include: {
          sprintStatusHistory: true,
        },
      },
    },
  });

  if (!sprint) {
    return res.status(404).json({ message: 'Sprint not found' });
  }

  const sprintHistoryPlotData = getDataForSprintChart(
    sprint,
    sprint.sprintHistory,
    sprint.backlog.notionStatusLinks
  );

  // Remove backlog and sprintHistory from the response to avoid sending unecessary data
  const { backlog, sprintHistory, ...restSprint } = sprint;

  const returnValue: GetSprintHistoryRequest['responseBody'] = {
    sprint: restSprint,
    sprintHistoryPlotData,
  };

  return res.status(200).json(returnValue);
}
