import { Sprint, SprintHistory, SprintStatusHistory } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { createSprint, CreateSprint } from 'utils/db/sprint/adapter';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

import { TIME_REGEX } from './[sprintId]';

export type SprintWithHistory = Sprint & {
  sprintHistory: (SprintHistory & {
    sprintStatusHistory: SprintStatusHistory[];
  })[];
};

export type PostCreateSprintRequest = APIRequest<
  { input: CreateSprint; backlogId: string },
  {
    sprint: Sprint;
  }
>;

const postSchema: PostCreateSprintRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    name: Joi.string().required(),
    goal: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notionSprintValue: Joi.string().required(),
    teamSpeed: Joi.number().required(),
    dayStartTime: Joi.string().regex(TIME_REGEX).required(),
    developers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.array().items(Joi.number()).required(),
      })
    ),
  }),
  backlogId: Joi.string().required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const teamId = req.query.teamId as string;

  switch (req.method) {
    case 'POST':
      return await postHandler(req, res, teamId, userId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userId: string
) => {
  const { body: bodyPost, error: errorPost } = parseAPIRequest(req, postSchema);

  if (errorPost || !bodyPost) {
    return apiError(res, { message: errorPost?.message ?? '' }, 400);
  }

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  const createdSprint = await createSprint(teamId, bodyPost.input);

  return apiResponse<PostCreateSprintRequest>(res, {
    sprint: createdSprint,
  });
};

export default handler;
