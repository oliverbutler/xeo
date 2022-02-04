import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Client } from '@notionhq/client';
import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { isNotNullOrUndefined } from '@xeo/utils';

export type GetNotionDatabasesResponse = {
  databases: {
    id: string;
    title: string;
    properties: GetDatabaseResponse['properties'];
  }[];
  hasMore: boolean;
};

export default async function getNotionDatabases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });

    const searchResult = await notion.search({
      filter: { value: 'database', property: 'object' },
    });

    const databases = searchResult.results
      .map((database) => {
        if (database.object === 'database') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const title = (database as any).title?.[0].plain_text;
          return { id: database.id, title, properties: database.properties };
        } else {
          return null;
        }
      })
      .filter(isNotNullOrUndefined);

    const response: GetNotionDatabasesResponse = {
      databases,
      hasMore: searchResult.has_more,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: `Error fetching Notion Databases` });
  }
}
