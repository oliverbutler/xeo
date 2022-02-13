import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { fetchAvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { prisma } from 'utils/db';

export type GetConnectionNotionDatabasesRequest = {
  method: 'GET';
  responseBody: {
    databases: {
      id: string;
      title: string;
      properties: GetDatabaseResponse['properties'];
    }[];
    hasMore: boolean;
  };
};

export default async function getConnectionNotionDatabases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  const notionConnectionId = req.query.id as string;

  if (req.method === 'GET') {
    const notionConnection = await prisma.notionConnection.findFirst({
      where: {
        createdByUserId: userId,
        id: notionConnectionId,
      },
    });

    if (!notionConnection) {
      return res.status(404).json({ message: 'Notion Connection not found' });
    }

    const { secretKey } = notionConnection;

    const databases = await fetchAvailableDatabasesFromNotion(secretKey);

    const returnValue: GetConnectionNotionDatabasesRequest['responseBody'] =
      databases;
    return res.status(200).json(returnValue);
  } else if (req.method === 'DELETE') {
    const notionConnection = await prisma.notionConnection.findFirst({
      where: {
        createdByUserId: userId,
        id: notionConnectionId,
      },
    });

    if (!notionConnection) {
      return res.status(404).json({ message: 'Notion Connection not found' });
    }

    try {
      await prisma.notionConnection.delete({
        where: {
          id: notionConnectionId,
        },
      });

      return res.status(200).json({ message: 'Notion Connection deleted' });
    } catch (error) {
      return res.status(500).json({
        message:
          'Error deleting, please make sure you have deleted any Backlogs',
      });
    }
  }
  return res.status(400).json({ message: 'Invalid request method' });
}
