import { Backlog, MemberOfBacklog, NotionConnection } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';
import { prisma } from 'utils/db';

enum ConnectionType {
  NOTION_CONNECTION = 'notion-connection',
}

export type BacklogWithMembersRestricted = Backlog & {
  members: (MemberOfBacklog & {
    user: {
      id: string;
      image: string | null;
      email: string | null;
      name: string | null;
    };
  })[];
};

type Connection = {
  type: ConnectionType.NOTION_CONNECTION;
  connection: NotionConnection;
  backlogs: BacklogWithMembersRestricted[];
};

export type GetConnectionsRequest = APIGetRequest<{
  connections: Connection[];
}>;

export default async function getSprints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return apiResponse(res, { message: 'Not authenticated' });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.id as string;

  if (req.method === 'GET') {
    const notionConnections = await prisma.notionConnection.findMany({
      where: {
        createdByUserId: userId,
      },
      include: {
        backlogs: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    image: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
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
}
