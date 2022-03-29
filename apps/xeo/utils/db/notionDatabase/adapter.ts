import {
  BacklogStatus,
  NotionColumnType,
  NotionDatabase,
  NotionStatusLink,
} from '@prisma/client';
import { logger } from 'utils/api';
import { prisma } from '..';

export type CreateNotionDatabase = {
  teamId: string;
  notionConnectionId: string;
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
};

export type UpdateNotionDatabase = {
  pointsColumnName: string;
  statusColumnName: string;
  sprintColumnType: NotionColumnType;
  sprintColumnName: string;
  parentRelationColumnName: string | undefined;
  updatedStatusMappings: {
    notionStatusLinkId: NotionStatusLink['id'];
    notionStatusName: string;
    notionStatusId: string;
    notionStatusColor: string;
    status: BacklogStatus;
    deleted: boolean;
  }[];
  newStatusMappings: {
    notionStatusName: string;
    notionStatusId: string;
    notionStatusColor: string;
    status: BacklogStatus;
  }[];
};

export const createNotionDatabase = async (input: CreateNotionDatabase) => {
  const result = await prisma.notionDatabase.create({
    data: {
      teamId: input.teamId,
      notionConnectionId: input.notionConnectionId,
      databaseId: input.notionDatabaseId,
      databaseName: input.notionDatabaseName,
      pointsColumnName: input.pointsColumnName,
      statusColumnName: input.statusColumnName,
      notionColumnType: input.sprintColumnType,
      sprintColumnName: input.sprintColumnName,
      parentRelationColumnName: input.parentRelationColumnName,
      notionStatusLinks: {
        createMany: {
          data: input.statusMapping.map((mapping) => ({
            notionStatusName: mapping.notionStatusName,
            notionStatusId: mapping.notionStatusId,
            notionStatusColor: mapping.notionStatusColor,
            status: mapping.status,
          })),
        },
      },
    },
  });

  return result;
};

export const updateNotionDatabase = async ({
  input,
  notionDatabase,
}: {
  notionDatabase: NotionDatabase;
  input: UpdateNotionDatabase;
}) => {
  try {
    input.updatedStatusMappings.forEach(
      async ({ notionStatusLinkId, ...data }) => {
        const updatedStatusMapping = await updateNotionStatusLink(
          notionDatabase.id,
          notionStatusLinkId,
          data
        );

        if (!updatedStatusMapping) {
          throw new Error(
            `Failed to update status mapping with id ${notionStatusLinkId}`
          );
        }
      }
    );

    input.newStatusMappings.forEach(async (data) => {
      const newStatusMapping = await createNotionStatusLink({
        notionDatabaseId: notionDatabase.id,
        ...data,
      });

      if (!newStatusMapping) {
        throw new Error(
          `Failed to create status mapping with name ${data.notionStatusName} for database ${notionDatabase.id}`
        );
      }
    });

    await prisma.notionDatabase.update({
      where: {
        teamId: notionDatabase.teamId,
      },
      data: {
        pointsColumnName: input.pointsColumnName,
        statusColumnName: input.statusColumnName,
        notionColumnType: input.sprintColumnType,
        sprintColumnName: input.sprintColumnName,
        parentRelationColumnName: input.parentRelationColumnName,
      },
    });
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

export const getNotionDatabase = async (teamId: string) => {
  const result = await prisma.notionDatabase.findUnique({
    where: {
      teamId,
    },
  });

  return result;
};

export const updateNotionStatusLink = async (
  notionDatabaseId: string,
  notionStatusLinkId: string,
  data: {
    status: BacklogStatus | undefined;
    notionStatusName: string | undefined;
    notionStatusId: string | undefined;
    notionStatusColor: string | undefined;
    deleted: boolean | undefined;
  }
) => {
  const currentNotionStatusLink = await prisma.notionStatusLink.findUnique({
    where: {
      id: notionStatusLinkId,
    },
  });

  if (!currentNotionStatusLink) {
    return false;
  }

  if (currentNotionStatusLink.notionDatabaseId !== notionDatabaseId) {
    return false;
  }

  const newDeletedAt = data.deleted
    ? currentNotionStatusLink.deletedAt || new Date()
    : null;

  try {
    await prisma.notionStatusLink.update({
      where: {
        id: notionStatusLinkId,
      },
      data: {
        status: data.status,
        notionStatusName: data.notionStatusName,
        notionStatusId: data.notionStatusId,
        notionStatusColor: data.notionStatusColor,
        deletedAt: newDeletedAt,
      },
    });
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

export const createNotionStatusLink = async (data: {
  notionDatabaseId: string;
  status: BacklogStatus;
  notionStatusName: string;
  notionStatusId: string;
  notionStatusColor: string;
}) => {
  try {
    const result = await prisma.notionStatusLink.create({
      data: {
        status: data.status,
        notionStatusName: data.notionStatusName,
        notionStatusId: data.notionStatusId,
        notionStatusColor: data.notionStatusColor,
        notionDatabaseId: data.notionDatabaseId,
      },
    });

    return result;
  } catch (e) {
    logger.error(e);
    return false;
  }
};
