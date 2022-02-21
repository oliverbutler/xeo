import { Client } from '@notionhq/client/build/src';
import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { isNotNullOrUndefined } from '@xeo/utils';
import axios from 'axios';

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

export const exchangeCodeForAccessToken = async (
  code: string
): Promise<
  | {
      accessToken: string;
      workspaceId: string;
      workspaceName: string | null;
      workspaceIcon: string | null;
      botId: string;
    }
  | undefined
> => {
  const authTokenBase64 = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      },
      {
        headers: {
          Authorization: `Basic ${authTokenBase64}`,
        },
      }
    );

    if (response.data.access_token === undefined) {
      return undefined;
    }

    const {
      access_token: accessToken,
      workspace_id: workspaceId,
      workspace_name: workspaceName,
      workspace_icon: workspaceIcon,
      bot_id: botId,
    } = response.data;

    return {
      accessToken,
      workspaceId,
      workspaceName: workspaceName ?? null,
      workspaceIcon: workspaceIcon ?? null,
      botId,
    };
  } catch (error) {
    return undefined;
  }
};
