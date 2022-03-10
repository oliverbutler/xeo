/* eslint-disable no-case-declarations */
import { Sprint, TeamRole } from '@prisma/client';
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
  deleteSprint,
  getSprintForTeam,
  updateSprint,
  UpdateSprint,
} from 'utils/sprint/adapter';
import { getUserRoleInTeam } from 'utils/team/adapter';

export type GetSprintRequest = APIGetRequest<{
  sprint: Sprint;
}>;

export type PutUpdateSprintRequest = APIRequest<
  { input: UpdateSprint },
  {
    sprint: Sprint;
  }
>;

export type DeleteSprintRequest = APIDeleteRequest<{ message: string }>;

export const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const putSchema: PutUpdateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string(),
    goal: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    notionSprintValue: Joi.string(),
    teamSpeed: Joi.number(),
    dayStartTime: Joi.string().regex(TIME_REGEX),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
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
    return apiError(res, { message: 'Not authorized' }, 403);
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, teamId, sprintId);
    case 'PUT':
      return await putHandler(req, res, sprintId);
    case 'DELETE':
      return await deleteHandler(req, res, sprintId, userRole);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  sprintId: string
) => {
  const sprint = await getSprintForTeam(sprintId, teamId);

  if (!sprint) {
    return apiError(res, { message: 'Sprint not found' }, 404);
  }

  return apiResponse<GetSprintRequest>(res, { sprint });
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprintId: string
) => {
  const { error, body } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  const updatedSprint = await updateSprint(sprintId, body.input);

  return apiResponse<PutUpdateSprintRequest>(res, { sprint: updatedSprint });
};

const deleteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sprintId: string,
  userRole: TeamRole
) => {
  if (userRole !== TeamRole.ADMIN && userRole !== TeamRole.OWNER) {
    return apiError(
      res,
      { message: 'Please ask an admin or owner to delete a sprint' },
      403
    );
  }

  await deleteSprint(sprintId);

  return apiResponse<DeleteSprintRequest>(res, { message: 'Sprint deleted' });
};

export default handler;
