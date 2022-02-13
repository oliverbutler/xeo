import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { DataPlotType, getDataForSprintChart } from 'utils/sprint/chart';
import { prisma } from 'utils/db';

export type GetSprintHistoryRequest = {
  method: 'GET';
  responseBody: {
    sprint: Sprint;
    sprintHistoryPlotData: DataPlotType[];
  };
};

/**
 * ⚠️ Public Facing Route
 */
export default async function getSprintHistoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sprintId = req.query.sprintId as string;

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
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

  // Remove backlog and sprintHistory from the response to avoid sending unnecessary data
  const { backlog, sprintHistory, ...restSprint } = sprint;

  const returnValue: GetSprintHistoryRequest['responseBody'] = {
    sprint: restSprint,
    sprintHistoryPlotData,
  };

  return res.status(200).json(returnValue);
}
