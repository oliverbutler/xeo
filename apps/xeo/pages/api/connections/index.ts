import { Backlog, NotionConnection } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';

enum ConnectionType {
  NOTION_CONNECTION = 'notion-connection',
}

export type Connection = {
  type: ConnectionType.NOTION_CONNECTION;
  connection: NotionConnection;
  backlogs: Backlog[];
};

export type GetConnectionsRequest = APIGetRequest<{
  connections: Connection[];
}>;

/**
 * ⚠️ Return contains Notion access token.
 *
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiResponse(res, { message: 'Not authenticated' });
  }

  const userId = session.id;

  if (req.method === 'GET') {
    const notionConnections = await prisma.notionConnection.findMany({
      where: {
        createdByUserId: userId,
      },
      include: {
        backlogs: true,
      },
    });

    const connections: Connection[] = notionConnections.map(
      ({ backlogs, ...connection }) => ({
        type: ConnectionType.NOTION_CONNECTION,
        connection,
        backlogs,
      })
    );

    return apiResponse<GetConnectionsRequest>(res, { connections });
  }
  return apiError(res, { message: 'Invalid request method' });
};

export default handler;
