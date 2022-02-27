import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { updateSprintHistoryIfChanged } from 'utils/sprint/sprint-history';

export type PostUpdateSprintHistory = APIRequest<
  {
    sprintId: string;
  },
  {
    updatedSprintPlotData: boolean;
  }
>;

const schema: PostUpdateSprintHistory['joiBodySchema'] = Joi.object({
  sprintId: Joi.string().required(),
});

/**
 * ⚠️ Public Facing Route
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, error } = parseAPIRequest(req, schema);

  if (error || !body) {
    return apiError(res, { message: error?.message ?? '' }, 400);
  }

  const { sprintId } = body;

  try {
    const updatedHistory = await updateSprintHistoryIfChanged(sprintId);

    return apiResponse<PostUpdateSprintHistory>(res, {
      updatedSprintPlotData: updatedHistory,
    });
  } catch (error) {
    return apiError(res, { message: 'Error updating sprint from Notion' }, 500);
  }
};

export default handler;
