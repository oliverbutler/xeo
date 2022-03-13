import {
  NotionConnection,
  NotionDatabase,
  NotionStatusLink,
} from '@prisma/client';
import { prisma } from '..';

export type NotionConnectionInformation = NotionConnection & {
  notionDatabase:
    | (NotionDatabase & {
        notionStatusLinks: NotionStatusLink[];
      })
    | null;
};

export const getNotionConnectionForTeam = async (
  teamId: string
): Promise<NotionConnectionInformation | null> => {
  const notionConnection = await prisma.notionConnection.findUnique({
    where: {
      teamId: teamId,
    },
    include: {
      notionDatabase: {
        include: {
          notionStatusLinks: true,
        },
      },
    },
  });

  return notionConnection;
};
