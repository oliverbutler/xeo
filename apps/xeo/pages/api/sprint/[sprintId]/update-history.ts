import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { APIRequest, parseAPIRequest } from 'utils/api';
import { updateSprintHistoryIfChanged } from 'utils/sprint/sprint-history';
import { withSentry } from '@sentry/nextjs';

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
    return res.status(400).json({ message: error?.message });
  }

  const { sprintId } = body;

  try {
    const updatedHistory = await updateSprintHistoryIfChanged(sprintId);

    const returnData: PostUpdateSprintHistory['response'] = {
      updatedSprintPlotData: updatedHistory,
    };

    return res.status(200).json(returnData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating sprint from Notion' });
  }
};

export default withSentry(handler);
