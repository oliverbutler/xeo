/* eslint-disable no-case-declarations */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { getUserMetadata } from 'utils/db/adapters/userMetadata';
import { UserMetadata } from 'utils/db/models/userMetadata';

export type GetMeRequest = APIGetRequest<
  | {
      hasMetaData: true;
      user: UserMetadata;
    }
  | {
      hasMetaData: false;
    }
>;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const user = await getUserMetadata(userId);

  if (req.method === 'GET') {
    if (!user) {
      return apiResponse<GetMeRequest>(res, {
        hasMetaData: false,
      });
    }
    return apiResponse<GetMeRequest>(res, { hasMetaData: true, user });
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;
