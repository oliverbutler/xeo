import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { DataPlotType } from 'utils/sprint/chart';
import { withSentry } from '@sentry/nextjs';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getSprintAndPlotDataForPage } from 'utils/sprint/sprint-history';

export type GetSprintColumnPlotData = APIGetRequest<{
  sprint: Sprint;
  sprintHistoryPlotData: DataPlotType[];
}>;

/**
 * ⚠️ Public Facing Route
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sprintId = req.query.sprintId as string;

  const sprintAndPlotData = await getSprintAndPlotDataForPage(sprintId);

  if (!sprintAndPlotData) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  return apiResponse<GetSprintColumnPlotData>(res, sprintAndPlotData);
};

export default withSentry(handler);
