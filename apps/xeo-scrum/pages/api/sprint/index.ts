import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

export type GetSprintsRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    sprints: Sprint[];
  };
};

export default async function getSprints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const sprints = await prisma.sprint.findMany({
    where: {
      userId: session.id as string,
    },
  });

  const returnValue: GetSprintsRequest['responseBody'] = {
    sprints,
  };

  return res.status(200).json(returnValue);
}
