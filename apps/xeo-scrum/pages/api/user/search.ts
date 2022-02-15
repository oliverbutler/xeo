import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
import { withSentry } from '@sentry/nextjs';

export type GetUserSearchRequest = {
  method: 'GET';
  requestQuery: {
    searchString: string;
  };
  responseBody: {
    user: {
      email: string | null;
      id: string;
      image: string | null;
      name: string | null;
    } | null;
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const searchString = req.query.searchString as string | undefined;

  if (req.method === 'GET') {
    const user = await prisma.user.findFirst({
      where: {
        email: searchString,
      },
      select: {
        id: true,
        image: true,
        email: true,
        name: true,
      },
    });

    const returnValue: GetUserSearchRequest['responseBody'] = {
      user,
    };

    return res.status(200).json(returnValue);
  }
  return res.status(400).json({ message: 'Invalid request method' });
};

export default withSentry(handler);
