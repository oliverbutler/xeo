import { Backlog, NotionStatusLink, Sprint } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
import {
  getProductBacklogFromNotionDatabase,
  ProductBacklog,
} from 'utils/notion/backlog';

export type GetBacklogRequest = {
  method: 'GET';
  requestBody: undefined;
  responseBody: {
    backlog: ProductBacklog;
    notionBacklog: Backlog;
  };
};

export type BacklogWithStatusLinksAndSprints = Backlog & {
  notionStatusLinks: NotionStatusLink[];
  sprints: Sprint[];
};

export default async function getBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const notionBacklog = await prisma.backlog.findFirst({
    where: {
      userId: session.id as string,
    },
    include: {
      notionStatusLinks: true,
      sprints: true,
    },
  });

  if (!notionBacklog) {
    return res
      .status(404)
      .json({ message: 'Backlog not found for your account' });
  }

  const productBacklog = await getProductBacklogFromNotionDatabase(
    notionBacklog
  );

  const returnValue: GetBacklogRequest['responseBody'] = {
    backlog: productBacklog,
    notionBacklog,
  };

  return res.status(200).json(returnValue);
}
