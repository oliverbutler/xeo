/* eslint-disable no-case-declarations */
import { Sprint } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { UserMetadata } from 'utils/db/db';
import { getUserMetadata } from 'utils/db/userMetadata';

export type GetUserRequest = APIGetRequest<{
  user: UserMetadata;
}>;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const user = await getUserMetadata(userId);

  if (!user) {
    return apiError(res, { message: 'User not found' }, 400);
  }

  if (req.method === 'GET') {
    return apiResponse(res, { user });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
