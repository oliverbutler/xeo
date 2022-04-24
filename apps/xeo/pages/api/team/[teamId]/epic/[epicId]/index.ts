import { NotionEpic, TeamRole } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  APIDeleteRequest,
  apiError,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import {
  deleteNotionEpic,
  updateNotionEpic,
  UpdateNotionEpic,
} from 'utils/db/epic/adapter';

import { getUserRoleInTeam } from 'utils/db/team/adapter';

export type PutUpdateNotionEpicRequest = APIRequest<
  { input: UpdateNotionEpic },
  {
    notionEpic: NotionEpic;
  }
>;

export type DeleteNotionEpicRequest = APIDeleteRequest<{ message: string }>;

const putSchema: PutUpdateNotionEpicRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    notionEpicName: Joi.string().optional(),
    notionEpicId: Joi.string().optional(),
    notionEpicIcon: Joi.string().optional(),
    active: Joi.boolean().optional(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const epicId = req.query.epicId as string;
  const teamId = req.query.teamId as string;
  const userId = session.id;

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'Not authorized' }, 403);
  }

  switch (req.method) {
    case 'PUT':
      return await putHandler(req, res, epicId);
    case 'DELETE':
      return await deleteHandler(req, res, epicId, userRole);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  epicId: string
) => {
  const { error, body } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, { message: error.message }, 400);
  }

  const notionEpic = await updateNotionEpic(epicId, body.input);

  return apiResponse<PutUpdateNotionEpicRequest>(res, {
    notionEpic,
  });
};

const deleteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  epicId: string,
  userRole: TeamRole
) => {
  if (userRole !== TeamRole.ADMIN && userRole !== TeamRole.OWNER) {
    return apiError(
      res,
      { message: 'Please ask an admin or owner to delete an epic' },
      403
    );
  }

  await deleteNotionEpic(epicId);

  return apiResponse<DeleteNotionEpicRequest>(res, {
    message: 'Notion Epic deleted',
  });
};

export default handler;
