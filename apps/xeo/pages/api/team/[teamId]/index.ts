import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  APIDeleteRequest,
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { Team, CreateTeam } from 'utils/db';
import { deleteTeam, getTeam, updateTeam } from 'utils/db/dynamodb';

export type DeleteTeamRequest = APIDeleteRequest<{
  success: boolean;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  switch (req.method) {
    case 'DELETE':
      return await deleteHandler(req, res);
    case 'PUT':
      return await putHandler(req, res);
    case 'GET':
      return await getHandler(req, res);
    default:
      return apiError(res, { message: 'Method not allowed' }, 405);
  }
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return apiError(res, { message: 'Team id is required' }, 400);
  }

  const team = await deleteTeam(teamId);

  if (!team) {
    return apiError(res, { message: 'Failed to create team' }, 400);
  }

  return apiResponse<DeleteTeamRequest>(res, { success: true });
};

export type GetTeamRequest = APIGetRequest<{
  team: Team;
}>;

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return apiError(res, { message: 'Team id is required' }, 400);
  }

  const team = await getTeam(teamId);

  if (!team) {
    return apiError(res, { message: "Team doesn't exist" }, 400);
  }

  return apiResponse<GetTeamRequest>(res, { team });
};

export type UpdateTeamRequest = APIRequest<
  { input: Partial<CreateTeam> },
  {
    team: Team;
  }
>;

const putSchema: UpdateTeamRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string(),
  }),
});

const putHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return apiError(res, { message: 'Team id is required' }, 400);
  }

  const { body: bodyPut, error: errorPut } = parseAPIRequest(req, putSchema);

  if (errorPut || !bodyPut) {
    return apiError(res, { message: errorPut?.message ?? '' }, 400);
  }

  const team = await updateTeam(teamId, bodyPut.input);

  if (!team) {
    return apiError(res, { message: 'Failed to update team' }, 400);
  }

  return apiResponse<UpdateTeamRequest>(res, { team });
};

export default handler;
