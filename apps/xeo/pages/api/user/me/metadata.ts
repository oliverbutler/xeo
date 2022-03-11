import { UserMetadata } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import {
  getUserWithMetadata,
  updateUserMetadata,
  UserWithMetadata,
} from 'utils/db/user/adapter';

export type PutUpdateUserMetadata = APIRequest<
  {
    input: {
      defaultTeamId?: string;
      preferredName?: string;
    };
  },
  {
    user: UserWithMetadata;
  }
>;

const putSchema: PutUpdateUserMetadata['joiBodySchema'] = Joi.object({
  input: Joi.object({
    defaultTeamId: Joi.string(),
    preferredName: Joi.string(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  switch (req.method) {
    case 'PUT':
      return putHandler(req, res, userId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  const { error, body } = parseAPIRequest(req, putSchema);

  if (error) {
    return apiError(res, error);
  }

  // If they want to update the team info, check that they have the right role
  if (body.input.defaultTeamId) {
    const teamRole = await getUserRoleInTeam(userId, body.input.defaultTeamId);
    if (!teamRole) {
      return apiError(
        res,
        { message: 'User is not a member of the team' },
        404
      );
    }
  }

  await updateUserMetadata(userId, body.input);

  const updatedUser = await getUserWithMetadata(userId);

  if (!updatedUser) {
    return apiError(res, { message: 'User not found' }, 404);
  }

  return apiResponse<PutUpdateUserMetadata>(res, {
    user: updatedUser,
  });
};

export default handler;
