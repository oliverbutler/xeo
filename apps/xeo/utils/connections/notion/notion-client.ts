import { Client } from '@notionhq/client/build/src';
import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { isNotNullOrUndefined } from '@xeo/utils';

interface AvailableDatabasesFromNotion {
  databases: {
    id: string;
    title: string;
    properties: GetDatabaseResponse['properties'];
  }[];
  hasMore: boolean;
}

export const fetchAvailableDatabasesFromNotion = async (
  secretKey: string
): Promise<AvailableDatabasesFromNotion> => {
  const notion = new Client({ auth: secretKey });

  const searchResult = await notion.search({
    filter: { value: 'database', property: 'object' },
  });

  const databases = searchResult.results
    .map((database) => {
      if (database.object === 'database') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = (database as any).title?.[0]?.plain_text ?? '';

        return { id: database.id, title, properties: database.properties };
      } else {
        return null;
      }
    })
    .filter(isNotNullOrUndefined);

  return { databases, hasMore: searchResult.has_more };
};
