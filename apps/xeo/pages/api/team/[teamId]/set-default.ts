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

export type PostUpdateUserDefaultTeamRequest = APIRequest<
  {},
  {
    user: UserWithMetadata;
  }
>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const teamId = req.query.teamId as string;

  switch (req.method) {
    case 'POST':
      return postHandler(req, res, userId, teamId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  teamId: string
) => {
  const teamRole = await getUserRoleInTeam(userId, teamId);

  if (!teamRole) {
    return apiError(res, { message: 'User is not a member of the team' }, 404);
  }

  await updateUserMetadata(userId, {
    defaultTeamId: teamId,
  });

  const updatedUser = await getUserWithMetadata(userId);

  if (!updatedUser) {
    return apiError(res, { message: 'User not found' }, 404);
  }

  return apiResponse<PostUpdateUserDefaultTeamRequest>(res, {
    user: updatedUser,
  });
};

export default handler;
