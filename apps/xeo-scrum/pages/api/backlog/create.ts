import { Backlog, BacklogStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import Joi from 'joi';
import { prisma } from 'utils/db';

export type PostCreateBacklog = APIRequest<
  {
    notionDatabaseId: string;
    notionDatabaseName: string;
    pointsColumnName: string;
    statusColumnName: string;
    sprintColumnName: string;
    statusMapping: {
      notionStatusId: string;
      status: BacklogStatus;
    }[];
  },
  {
    backlog: Backlog;
  }
>;

const schema: PostCreateBacklog['joiBodySchema'] = Joi.object({
  notionDatabaseId: Joi.string().required(),
  notionDatabaseName: Joi.string().required(),
  pointsColumnName: Joi.string().required(),
  statusColumnName: Joi.string().required(),
  sprintColumnName: Joi.string().required(),
  statusMapping: Joi.array().items(
    Joi.object({
      notionStatusId: Joi.string().required(),
      status: Joi.string()
        .valid(...Object.values(BacklogStatus))
        .required(),
    })
  ),
});

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

  const result = await prisma.backlog.create({
    data: {
      databaseId: body.notionDatabaseId,
      databaseName: body.notionDatabaseName,
      pointsColumnName: body.pointsColumnName,
      statusColumnName: body.statusColumnName,
      sprintColumnName: body.sprintColumnName,
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
