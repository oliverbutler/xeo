import { NextApiRequest, NextApiResponse } from 'next';

import { withSentry } from '@sentry/nextjs';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import Joi from 'joi';
import { exchangeCodeForAccessToken } from 'utils/connections/notion/notion-client';
import { NotionOAuthCallbackState } from './auth-url';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';

export type PostNotionCallback = APIRequest<
  { code: string; state: NotionOAuthCallbackState },
  { successMessage: string }
>;

const schema: PostNotionCallback['joiBodySchema'] = Joi.object({
  code: Joi.string().required(),
  state: Joi.object({
    requestedByUserId: Joi.string().required(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { body, error } = parseAPIRequest(req, schema);

  if (error || !body) {
    return apiError(res, { message: error?.message ?? '' }, 400);
  }

  const {
    code,
    state: { requestedByUserId },
  } = body;

  const notionAccessResponse = await exchangeCodeForAccessToken(code);

  if (!notionAccessResponse) {
    return apiError(
      res,
      { message: 'Problem connecting to Notion, please try again' },
      400
    );
  }

  // If the user already has the connection, update it
  const existingNotionConnection = await prisma.notionConnection.findFirst({
    where: { notionBotId: notionAccessResponse.botId },
  });

  if (existingNotionConnection) {
    await prisma.notionConnection.update({
      where: {
        id: existingNotionConnection.id,
      },
      data: {
        accessToken: notionAccessResponse.accessToken,
        notionBotId: notionAccessResponse.botId,
        notionWorkspaceId: notionAccessResponse.workspaceId,
        notionWorkspaceName: notionAccessResponse.workspaceName,
        notionWorkspaceIcon: notionAccessResponse.workspaceIcon,
      },
    });

    return apiResponse<PostNotionCallback>(res, {
      successMessage: 'Updated existing Notion Connection',
    });
  }

  await prisma.notionConnection.create({
    data: {
      accessToken: notionAccessResponse.accessToken,
      notionBotId: notionAccessResponse.botId,
      notionWorkspaceId: notionAccessResponse.workspaceId,
      notionWorkspaceName: notionAccessResponse.workspaceName,
      notionWorkspaceIcon: notionAccessResponse.workspaceIcon,
      createdByUserId: requestedByUserId,
    },
  });
  return apiResponse<PostNotionCallback>(res, {
    successMessage: 'Created new Notion Connection',
  });
};

export default withSentry(handler);
