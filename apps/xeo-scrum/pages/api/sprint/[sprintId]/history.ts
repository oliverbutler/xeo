import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { DataPlotType, getDataForSprintChart } from 'utils/sprint/chart';
import { getSprintWithHistory } from 'utils/sprint/sprint-history';

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

  const sprintId = req.query.sprintId as string;

  const sprint = await getSprintWithHistory(sprintId);

  if (!sprint) {
    return res.status(404).json({ message: 'Sprint not found' });
  }

  const sprintHistoryPlotData = getDataForSprintChart(
    sprint.sprintHistory,
    sprint.notionStatusLinks
  );

  const returnValue: GetSprintHistoryRequest['responseBody'] = {
    sprint: sprint.sprint,
    sprintHistoryPlotData,
  };

  return res.status(200).json(returnValue);
}
