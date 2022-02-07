import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

export type GetSprintRequest = {
  requestBody: undefined;
  responseBody: {
    sprint: Sprint;
  };
};

export default async function getSprint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const sprint = await prisma.sprint.findFirst({
    where: {
      id: req.query.sprintId as string,
    },
  });

  if (!sprint) {
    return res.status(404).json({ message: 'Sprint not found' });
  }

  const returnValue: GetSprintRequest['responseBody'] = {
    sprint,
  };

  return res.status(200).json(returnValue);
}
