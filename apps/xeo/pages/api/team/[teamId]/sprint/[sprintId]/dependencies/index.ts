import { NextApiRequest, NextApiResponse } from 'next';
import {
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import {
  DependencyPosition,
  getSprintDependencies,
  getSprintForTeam,
  updateSprintDependencies,
} from 'utils/db/sprint/adapter';
import Joi from 'joi';

export type GetSprintDependencies = APIGetRequest<{
  dependencies: DependencyPosition[];
}>;

export type PutUpdateSprintDependencies = APIRequest<
  {
    dependencies: DependencyPosition[];
  },
  {
    success: boolean;
  }
>;

const putSchema: PutUpdateSprintDependencies['joiBodySchema'] = Joi.object({
  dependencies: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
      }).required(),
    })
  ),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const sprintId = req.query.sprintId as string;
  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  // Check the sprint exists for the team
  const sprint = await getSprintForTeam(sprintId, teamId);

  if (!sprint) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, sprintId);
    case 'PUT':
      return await putHandler(req, res, sprintId);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprintId: string
) => {
  const dependencies = (await getSprintDependencies(sprintId)) ?? [];

  return apiResponse<GetSprintDependencies>(res, { dependencies });
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprintId: string
) => {
  const { body, error } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  await updateSprintDependencies(sprintId, body.dependencies);

  return apiResponse<PutUpdateSprintDependencies>(res, { success: true });
};

export default handler;
