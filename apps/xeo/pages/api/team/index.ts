import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { createTeam, CreateTeam, getTeams, Team } from 'utils/db/dynamodb';

export type PostCreateTeamRequest = APIRequest<
  { input: CreateTeam },
  {
    team: Team;
  }
>;

export type GetTeamsRequest = APIGetRequest<{ teams: Team[] }>;

const postSchema: PostCreateTeamRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    teamName: Joi.string().required(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  switch (req.method) {
    case 'POST':
      return await postHandler(req, res);
    case 'DELETE':
      return await deleteHandler(req, res);
    case 'GET':
      return await getHandler(req, res);
    default:
      return apiError(res, { message: 'Method not allowed' }, 405);
  }
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: bodyPost, error: errorPost } = parseAPIRequest(req, postSchema);

  if (errorPost || !bodyPost) {
    return apiError(res, { message: errorPost?.message ?? '' }, 400);
  }

  const team = await createTeam(bodyPost.input);

  if (!team) {
    return apiError(res, { message: 'Failed to create team' }, 400);
  }
  return apiResponse<PostCreateTeamRequest>(res, { team });
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const teams = await getTeams();

  if (!teams) {
    return apiError(res, { message: 'Failed to get teams' }, 400);
  }

  return apiResponse<GetTeamsRequest>(res, { teams });
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: bodyDelete, error: errorDelete } = parseAPIRequest(
    req,
    postSchema
  );

  if (errorDelete || !bodyDelete) {
    return apiError(res, { message: errorDelete?.message ?? '' }, 400);
  }

  const team = await createTeam(bodyDelete.input);

  if (!team) {
    return apiError(res, { message: 'Failed to create team' }, 400);
  }

  return apiResponse<PostCreateTeamRequest>(res, { team });
};

export default handler;
