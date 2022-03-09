import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { createTeam } from 'utils/db/adapters/team';
import { CreateTeam, Team } from 'utils/db/models/team';

export type CreateTeamRequest = APIRequest<
  { input: CreateTeam },
  { team: Team }
>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  switch (req.method) {
    case 'POST':
      return postHandler(req, res);
    default:
      return apiError(res, { message: 'Method not allowed' }, 405);
  }
};

const postSchema: CreateTeamRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string().required(),
    shortName: Joi.string().required(),
    companyName: Joi.string().required(),
  }).required(),
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, error } = parseAPIRequest(req, postSchema);

  if (error) {
    return apiError(res, error);
  }

  const team = await createTeam(body.input);

  if (!team) {
    return apiError(res, { message: 'Issue creating team' }, 500);
  }

  return apiResponse<CreateTeamRequest>(res, { team: team }, 201);
};

export default handler;
