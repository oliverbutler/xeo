import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { apiError, APIGetRequest, apiResponse } from 'utils/api';

export type NotionOAuthCallbackState = {
  requestedByUserId: string;
  teamId: string;
};

export const isNotionAuthCallbackState = (
  state: unknown
): state is NotionOAuthCallbackState => {
  if (typeof state !== 'object') {
    return false;
  }
  if ((state as NotionOAuthCallbackState)?.requestedByUserId === undefined) {
    return false;
  }
  if ((state as NotionOAuthCallbackState)?.teamId === undefined) {
    return false;
  }
  return true;
};

export type GetNotionAuthURL = APIGetRequest<{ url: string }>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const teamId = req.query.teamId as string;

  if (!teamId) {
    return apiError(res, { message: 'Missing teamId query parameter' }, 400);
  }

  const state: NotionOAuthCallbackState = {
    requestedByUserId: session.id,
    teamId,
  };

  const notionOauthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${
    process.env.NOTION_CLIENT_ID
  }&response_type=code&redirect_uri=${
    process.env.NOTION_REDIRECT_URI
  }&state=${JSON.stringify(state)}`;

  return apiResponse<GetNotionAuthURL>(res, { url: notionOauthUrl }, 200);
};

export default handler;
