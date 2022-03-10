/* eslint-disable no-case-declarations */
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getUserWithMetadata, UserWithMetadata } from 'utils/db/user/adapter';

export type GetMeRequest = APIGetRequest<{ user: UserWithMetadata }>;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const user = await getUserWithMetadata(userId);

  if (!user) {
    return apiError(res, { message: 'User not found' }, 404);
  }

  if (req.method === 'GET') {
    return apiResponse<GetMeRequest>(res, { user });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
