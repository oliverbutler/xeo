import {
  Backlog,
  BacklogStatus,
  NotionColumnType,
  NotionConnection,
} from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import Joi from 'joi';
import { prisma } from 'utils/db';

export type PostCreateBacklog = APIRequest<
  {
    notionConnectionId: NotionConnection['id'];
    notionDatabaseId: string;
    notionDatabaseName: string;
    pointsColumnName: string;
    statusColumnName: string;
    sprintColumnType: NotionColumnType;
    sprintColumnName: string;
    statusMapping: {
      notionStatusName: string;
      notionStatusColor: string;
      status: BacklogStatus;
    }[];
  },
  {
    backlog: Backlog;
  }
>;

const schema: PostCreateBacklog['joiBodySchema'] = Joi.object({
  notionConnectionId: Joi.string().required(),
  notionDatabaseId: Joi.string().required(),
  notionDatabaseName: Joi.string().required(),
  pointsColumnName: Joi.string().required(),
  statusColumnName: Joi.string().required(),
  sprintColumnType: Joi.string()
    .valid(...Object.values(NotionColumnType))
    .required(),
  sprintColumnName: Joi.string().required(),
  statusMapping: Joi.array().items(
    Joi.object({
      notionStatusName: Joi.string().required(),
      notionStatusColor: Joi.string().required(),
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

  if (error || !body) {
    return res.status(400).json({ message: error?.message });
  }

  const result = await prisma.backlog.create({
    data: {
      notionConnectionId: body.notionConnectionId,
      databaseId: body.notionDatabaseId,
      databaseName: body.notionDatabaseName,
      pointsColumnName: body.pointsColumnName,
      statusColumnName: body.statusColumnName,
      notionColumnType: body.sprintColumnType,
      sprintColumnName: body.sprintColumnName,
      notionStatusLinks: {
        createMany: {
          data: body.statusMapping.map((mapping) => ({
            notionStatusName: mapping.notionStatusName,
            notionStatusColor: mapping.notionStatusColor,
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
