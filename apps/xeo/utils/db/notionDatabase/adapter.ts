import { BacklogStatus, NotionColumnType } from '@prisma/client';
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
  statusMapping: {
    notionStatusName: string;
    notionStatusColor: string;
    status: BacklogStatus;
  }[];
};

export type UpdateNotionDatabase = {
  teamId: string;
  notionConnectionId: string;
  notionDatabaseId: string;
  notionDatabaseName: string;
  pointsColumnName: string;
  statusColumnName: string;
  sprintColumnType: NotionColumnType;
  sprintColumnName: string;
  updatedStatusMappings: {
    notionStatusId: string;
    notionStatusName: string;
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
      notionStatusLinks: {
        createMany: {
          data: input.statusMapping.map((mapping) => ({
            notionStatusName: mapping.notionStatusName,
            notionStatusColor: mapping.notionStatusColor,
            status: mapping.status,
          })),
        },
      },
    },
  });

  return result;
};

export const updateNotionDatabase = async (input: UpdateNotionDatabase) => {
  try {
    input.updatedStatusMappings.forEach(async (status) => {
      const existingNotionStatusLink = await prisma.notionStatusLink.findUnique(
        {
          where: {
            id: status.notionStatusId,
          },
        }
      );

      if (!existingNotionStatusLink) {
        throw new Error('Notion status link not found');
      }

      if (
        existingNotionStatusLink.notionDatabaseId !== input.notionDatabaseId
      ) {
        throw new Error('Notion status link does not belong to this database');
      }

      await prisma.notionStatusLink.update({
        where: {
          id: status.notionStatusId,
        },
        data: {
          notionStatusName: status.notionStatusName,
          notionStatusColor: status.notionStatusColor,
          status: status.status,
        },
      });
    });

    await prisma.notionDatabase.update({
      where: {
        teamId: input.teamId,
      },
      data: {
        teamId: input.teamId,
        notionConnectionId: input.notionConnectionId,
        databaseId: input.notionDatabaseId,
        databaseName: input.notionDatabaseName,
        pointsColumnName: input.pointsColumnName,
        statusColumnName: input.statusColumnName,
        notionColumnType: input.sprintColumnType,
        sprintColumnName: input.sprintColumnName,
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
