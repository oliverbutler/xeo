import { Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

export type GetSprintsRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    sprints: Sprint[];
    currentSprintId: string | null;
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

  const backlogAndSprints = await prisma.backlog.findFirst({
    where: {
      userId: session.id as string,
    },
    include: {
      sprints: true,
    },
  });

  if (!backlogAndSprints) {
    return res
      .status(404)
      .json({ message: 'Backlog not found for your account' });
  }

  const returnValue: GetSprintsRequest['responseBody'] = {
    sprints: backlogAndSprints.sprints,
    currentSprintId: backlogAndSprints.currentSprintId,
  };

  return res.status(200).json(returnValue);
}
