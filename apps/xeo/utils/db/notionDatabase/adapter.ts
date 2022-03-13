import { BacklogStatus, NotionColumnType } from '@prisma/client';
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
