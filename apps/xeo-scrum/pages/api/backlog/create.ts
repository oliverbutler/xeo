import { NotionBacklog, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export type PostCreateBacklogResponse = {
  backlog: NotionBacklog;
};

export type PostCreateBacklogBody = {
  notionDatabaseId: string;
  notionDatabaseName: string;
  pointsColumnId: string;
  statusColumnId: string;
  sprintColumnId: string;
};

const prisma = new PrismaClient();

export default async function createBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const {
    notionDatabaseId,
    notionDatabaseName,
    pointsColumnId,
    statusColumnId,
    sprintColumnId,
  } = req.body;

  if (
    !notionDatabaseId ||
    !notionDatabaseName ||
    !pointsColumnId ||
    !statusColumnId ||
    !sprintColumnId
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const result = await prisma.notionBacklog.create({
    data: {
      databaseId: notionDatabaseId,
      databaseName: notionDatabaseName,
      pointsColumnId,
      statusColumnId,
      sprintColumnId,
      userId: session.id as string,
    },
  });

  const returnValue: PostCreateBacklogResponse = {
    backlog: result,
  };

  return res.status(200).json(returnValue);
}
