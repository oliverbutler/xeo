import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest } from 'utils/api';
import { Team } from 'utils/db/db';

export type GetTeamsRequest = APIGetRequest<{ teams: Team[] }>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  switch (req.method) {
    default:
      return apiError(res, { message: 'Method not allowed' }, 405);
  }
};

export default handler;
