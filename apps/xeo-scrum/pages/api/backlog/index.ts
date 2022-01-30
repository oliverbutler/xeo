import { NotionBacklog, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  getProductBacklogFromNotionDatabase,
  ProductBacklog,
} from 'utils/notion/backlog';

export type GetBacklogRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    backlog: ProductBacklog;
  };
};

const prisma = new PrismaClient();

export default async function getBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const notionBacklog = await prisma.notionBacklog.findFirst({
    where: {
      userId: session.id as string,
    },
  });

  const productBacklog = await getProductBacklogFromNotionDatabase(
    notionBacklog
  );

  const returnValue: GetBacklogRequest['responseBody'] = {
    backlog: productBacklog,
  };

  return res.status(200).json(returnValue);
}
