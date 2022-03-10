import { Team, TeamRole } from '@prisma/client';
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
import {
  CreateTeam,
  deleteTeam,
  getTeamWithSprintsAndMembers,
  getUserRoleInTeam,
  TeamWithSprintsAndMembers,
  updateTeam,
} from 'utils/team/adapter';

export type DeleteTeamRequest = APIDeleteRequest<{
  success: boolean;
}>;

export type GetTeamWithMembersAndSprintsRequest = APIGetRequest<{
  team: TeamWithSprintsAndMembers;
}>;

export type UpdateTeamRequest = APIRequest<
  { input: Partial<CreateTeam> },
  {
    team: Team;
  }
>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const { teamId } = req.query;

  if (!teamId || typeof teamId !== 'string') {
    return apiError(res, { message: 'Team id is required' }, 400);
  }

  const userRole = await getUserRoleInTeam(session.id, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  switch (req.method) {
    case 'DELETE':
      return await deleteHandler(req, res, teamId, userRole);
    case 'PUT':
      return await putHandler(req, res, teamId, userRole);
    case 'GET':
      return await getHandler(req, res, teamId);
    default:
      return apiError(res, { message: 'Method not allowed' }, 405);
  }
};

const deleteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userRole: TeamRole
) => {
  if (userRole !== TeamRole.OWNER) {
    return apiError(
      res,
      { message: 'You are not authorized to delete this team' },
      401
    );
  }

  const team = await deleteTeam(teamId);

  if (!team) {
    return apiError(res, { message: 'Failed to create team' }, 400);
  }

  return apiResponse<DeleteTeamRequest>(res, { success: true });
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const team = await getTeamWithSprintsAndMembers(teamId);

  if (!team) {
    return apiError(res, { message: "Team doesn't exist" }, 400);
  }

  return apiResponse<GetTeamWithMembersAndSprintsRequest>(res, { team });
};

const putSchema: UpdateTeamRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string(),
    shortName: Joi.string(),
    companyName: Joi.string(),
  }),
});

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userRole: TeamRole
) => {
  if (userRole !== TeamRole.OWNER && userRole !== TeamRole.ADMIN) {
    return apiError(
      res,
      { message: 'You are not authorized to update this team' },
      401
    );
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
