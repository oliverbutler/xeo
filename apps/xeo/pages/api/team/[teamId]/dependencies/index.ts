import { NextApiRequest, NextApiResponse } from 'next';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { getSession } from 'next-auth/react';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import {
  DependencyPosition,
  getSprintForTeam,
  updateNotionEpicDependencies,
  updateSprintDependencies,
} from 'utils/db/sprint/adapter';
import Joi from 'joi';
import { getNotionEpicForTeam } from 'utils/db/epic/adapter';

export type PutUpdateSprintDependencies = APIRequest<
  {
    type: 'epicId' | 'sprintId';
    id: string;
    dependencies: DependencyPosition[];
  },
  {
    success: boolean;
  }
>;

const putSchema: PutUpdateSprintDependencies['joiBodySchema'] = Joi.object({
  type: Joi.string().valid('epicId', 'sprintId').required(),
  id: Joi.string().required(),
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

  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  switch (req.method) {
    case 'PUT':
      return await putHandler(req, res, teamId);
  }

  return apiError(res, { message: 'Not implemented' }, 501);
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const { body, error } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  if (body.type === 'sprintId') {
    const sprint = await getSprintForTeam(body.id, teamId);

    if (!sprint) {
      return apiError(res, { message: 'Sprint not found' }, 404);
    }

    await updateSprintDependencies(sprint.id, body.dependencies);

    return apiResponse<PutUpdateSprintDependencies>(res, { success: true });
  }

  const epic = await getNotionEpicForTeam(body.id, teamId);

  if (!epic) {
    return apiError(res, { message: 'Epic not found' }, 404);
  }

  await updateNotionEpicDependencies(epic.id, body.dependencies);

  return apiResponse<PutUpdateSprintDependencies>(res, { success: true });
};

export default handler;
