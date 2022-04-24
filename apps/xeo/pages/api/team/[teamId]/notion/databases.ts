import {
  BacklogStatus,
  NotionColumnType,
  NotionConnection,
  NotionDatabase,
  NotionStatusLink,
} from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  apiError,
  APIGetRequest,
  APIRequest,
  apiResponse,
  parseAPIRequest,
} from 'utils/api';
import {
  AvailableDatabasesFromNotion,
  fetchAvailableDatabasesFromNotion,
} from 'utils/connections/notion/notion-client';
import { prisma } from 'utils/db';
import { getNotionConnectionForTeam } from 'utils/db/notionConnection/adapter';
import {
  createNotionDatabase,
  updateNotionDatabase,
} from 'utils/db/notionDatabase/adapter';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

export type GetConnectionNotionDatabasesRequest = APIGetRequest<{
  notionResponse: AvailableDatabasesFromNotion;
}>;

export type PutUpdateNotionDatabaseRequest = APIRequest<
  {
    pointsColumnName: string;
    statusColumnName: string;
    sprintColumnType: NotionColumnType;
    sprintColumnName: string;
    parentRelationColumnName: string | undefined;
    epicRelationColumnId: string | undefined;
    updatedStatusMappings: {
      notionStatusLinkId: NotionStatusLink['id'];
      notionStatusName: string;
      notionStatusId: string;
      notionStatusColor: string;
      status: BacklogStatus;
      deleted: boolean;
    }[];
    newStatusMappings: {
      status: BacklogStatus;
      notionStatusName: string;
      notionStatusId: string;
      notionStatusColor: string;
    }[];
  },
  {
    success: boolean;
  }
>;

export type PostCreateNotionDatabaseRequest = APIRequest<
  {
    notionConnectionId: NotionConnection['id'];
    notionDatabaseId: string;
    notionDatabaseName: string;
    pointsColumnName: string;
    statusColumnName: string;
    sprintColumnType: NotionColumnType;
    sprintColumnName: string;
    parentRelationColumnName: string | undefined;
    statusMapping: {
      notionStatusName: string;
      notionStatusId: string;
      notionStatusColor: string;
      status: BacklogStatus;
    }[];
  },
  {
    notionDatabase: NotionDatabase;
  }
>;

const postSchema: PostCreateNotionDatabaseRequest['joiBodySchema'] = Joi.object(
  {
    notionConnectionId: Joi.string().required(),
    notionDatabaseId: Joi.string().required(),
    notionDatabaseName: Joi.string().required(),
    pointsColumnName: Joi.string().required(),
    statusColumnName: Joi.string().required(),
    sprintColumnType: Joi.string()
      .valid(...Object.values(NotionColumnType))
      .required(),
    sprintColumnName: Joi.string().required(),
    parentRelationColumnName: Joi.string(),
    statusMapping: Joi.array().items(
      Joi.object({
        notionStatusName: Joi.string().required(),
        notionStatusId: Joi.string().required(),
        notionStatusColor: Joi.string().required(),
        status: Joi.string()
          .valid(...Object.values(BacklogStatus))
          .required(),
      })
    ),
  }
);

const putSchema: PutUpdateNotionDatabaseRequest['joiBodySchema'] = Joi.object({
  pointsColumnName: Joi.string().required(),
  statusColumnName: Joi.string().required(),
  sprintColumnType: Joi.string()
    .valid(...Object.values(NotionColumnType))
    .required(),
  sprintColumnName: Joi.string().required(),
  parentRelationColumnName: Joi.string(),
  epicRelationColumnId: Joi.string(),
  updatedStatusMappings: Joi.array().items(
    Joi.object({
      notionStatusLinkId: Joi.string().required(),
      notionStatusName: Joi.string().required(),
      notionStatusId: Joi.string().required(),
      notionStatusColor: Joi.string().required(),
      status: Joi.string()
        .valid(...Object.values(BacklogStatus))
        .required(),
      deleted: Joi.boolean().required(),
    })
  ),
  newStatusMappings: Joi.array().items(
    Joi.object({
      status: Joi.string()

        .valid(...Object.values(BacklogStatus))
        .required(),
      notionStatusName: Joi.string().required(),
      notionStatusId: Joi.string().required(),
      notionStatusColor: Joi.string().required(),
    })
  ),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const callingUserId = session.id;
  const teamId = req.query.teamId as string;

  if (!teamId) {
    return apiError(res, { message: 'Missing required query parameters' });
  }

  const callingUserRole = await getUserRoleInTeam(callingUserId, teamId);

  if (!callingUserRole) {
    return apiError(res, { message: 'User is not a member of the team' });
  }

  if (callingUserRole !== 'OWNER') {
    return apiError(res, {
      message: "User isn't an owner or admin of the team",
    });
  }

  switch (req.method) {
    case 'GET':
      return getHandler(req, res, teamId);
    case 'POST':
      return postHandler(req, res, teamId);
    case 'PUT':
      return putHandler(req, res, teamId);
  }

  return res.status(400).json({ message: 'Invalid request method' });
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const notionConnection = await getNotionConnectionForTeam(teamId);

  if (!notionConnection) {
    return apiError(res, { message: 'Notion connection not found' });
  }

  const databases = await fetchAvailableDatabasesFromNotion(
    notionConnection.accessToken
  );

  return apiResponse<GetConnectionNotionDatabasesRequest>(res, {
    notionResponse: databases,
  });
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const { body, error } = parseAPIRequest(req, postSchema);

  if (error || !body) {
    return apiError(res, { message: error?.message });
  }

  const newDatabase = await createNotionDatabase({ ...body, teamId });

  return apiResponse<PostCreateNotionDatabaseRequest>(res, {
    notionDatabase: newDatabase,
  });
};

const putHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const { body, error } = parseAPIRequest(req, putSchema);

  if (error || !body) {
    return apiError(res, { message: error?.message });
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      notionDatabase: true,
    },
  });

  if (!team) {
    return apiError(res, { message: 'Team not found' });
  }

  if (!team.notionDatabase) {
    return apiError(res, {
      message: 'Notion database connection not found',
    });
  }

  await updateNotionDatabase({
    input: body,
    notionDatabase: team.notionDatabase,
  });

  return apiResponse<PutUpdateNotionDatabaseRequest>(res, {
    success: true,
  });
};

export default handler;
