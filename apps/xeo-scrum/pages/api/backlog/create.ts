import { NotionBacklog, PrismaClient, BacklogStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import Joi from 'joi';

export type PostCreateBacklog = APIRequest<
  {
    notionDatabaseId: string;
    notionDatabaseName: string;
    pointsColumnId: string;
    statusColumnId: string;
    sprintColumnId: string;
    statusMapping: {
      notionStatusId: string;
      status: BacklogStatus;
    }[];
  },
  {
    backlog: NotionBacklog;
  }
>;

const schema: PostCreateBacklog['joiBodySchema'] = Joi.object({
  notionDatabaseId: Joi.string().required(),
  notionDatabaseName: Joi.string().required(),
  pointsColumnId: Joi.string().required(),
  statusColumnId: Joi.string().required(),
  sprintColumnId: Joi.string().required(),
  statusMapping: Joi.array().items(
    Joi.object({
      notionStatusId: Joi.string().required(),
      status: Joi.string()
        .valid(...Object.values(BacklogStatus))
        .required(),
    })
  ),
});

const prisma = new PrismaClient();

export default async function createBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { body, error } = parseAPIRequest(req, schema);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const result = await prisma.notionBacklog.create({
    data: {
      databaseId: body.notionDatabaseId,
      databaseName: body.notionDatabaseName,
      pointsColumnId: body.pointsColumnId,
      statusColumnId: body.statusColumnId,
      sprintColumnId: body.sprintColumnId,
      userId: session.id as string,
      notionStatusLinks: {
        createMany: {
          data: body.statusMapping.map((mapping) => ({
            notionStatusId: mapping.notionStatusId,
            status: mapping.status,
          })),
        },
      },
    },
  });

  const returnValue: PostCreateBacklog['response'] = {
    backlog: result,
  };

  return res.status(200).json(returnValue);
}
