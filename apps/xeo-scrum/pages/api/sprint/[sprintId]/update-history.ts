import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
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

export default async function updateSprintHistory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { body, error } = parseAPIRequest(req, schema);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { sprintId } = body;

  const updatedHistory = await updateSprintHistoryIfChanged(sprintId);

  return res.status(200).json({ updatedSprintPlotData: updatedHistory });
}
