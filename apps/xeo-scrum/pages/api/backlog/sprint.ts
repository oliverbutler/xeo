import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
import {
  getProductBacklogForSprint,
  ProductBacklog,
} from 'utils/notion/backlog';

export type GetBacklogSprintRequest = {
  method: 'GET';
  query: {
    notionSprintId: string;
  };
  responseBody: {
    backlog: ProductBacklog;
  };
};

const schema = Joi.object<GetBacklogSprintRequest['query']>({
  notionSprintId: Joi.string().required(),
});

export default async function getBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const notionSprintId = value.notionSprintId;

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

  const productBacklog = await getProductBacklogForSprint(
    notionBacklog,
    notionBacklog.sprintColumnName,
    notionSprintId
  );

  const returnValue: GetBacklogSprintRequest['responseBody'] = {
    backlog: productBacklog,
  };

  return res.status(200).json(returnValue);
}
