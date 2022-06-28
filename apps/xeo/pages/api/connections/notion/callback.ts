import { NextApiRequest, NextApiResponse } from 'next';

import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import Joi from 'joi';
import { exchangeCodeForAccessToken } from 'utils/connections/notion/notion-client';
import { NotionOAuthCallbackState } from './auth-url';
import { getSession } from 'next-auth/react';
import { prisma } from 'utils/db';
import { getUserRoleInTeam } from 'utils/db/team/adapter';
import { TeamRole } from '@prisma/client';

export type PostNotionCallback = APIRequest<
  { code: string; state: NotionOAuthCallbackState },
  { successMessage: string }
>;

const schema: PostNotionCallback['joiBodySchema'] = Joi.object({
  code: Joi.string().required(),
  state: Joi.object({
    requestedByUserId: Joi.string().required(),
    teamId: Joi.string().required(),
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
    state: { requestedByUserId, teamId },
  } = body;

  const notionAccessResponse = await exchangeCodeForAccessToken(code);

  if (!notionAccessResponse) {
    return apiError(
      res,
      { message: 'Problem connecting to Notion, please try again' },
      400
    );
  }

  // Check the requestedByUser is the same as the user who is logged in
  if (requestedByUserId !== session.id) {
    return apiError(
      res,
      { message: 'You are not the user who requested the connection' },
      400
    );
  }

  // Check the user is the owner of the team
  const userRole = await getUserRoleInTeam(session.id, teamId);

  if (userRole !== TeamRole.OWNER) {
    return apiError(res, { message: 'You are not the owner of the team' }, 400);
  }

  // TODO find out if we should make botIds unique

  // If the user already has the connection, update it
  const existingNotionConnection = await prisma.notionConnection.findFirst({
    where: { teamId },
  });

  if (existingNotionConnection) {
    // if the new connection is different workspace id error

    // TODO: Remove this check to allow transferring of Workspace
    // if (
    //   notionAccessResponse.workspaceId !==
    //   existingNotionConnection.notionWorkspaceId
    // ) {
    //   return apiError(
    //     res,
    //     {
    //       message:
    //         'You cant change the Workspace associated with your Xeo Team',
    //     },
    //     400
    //   );
    // }

    await prisma.notionConnection.update({
      where: {
        id: existingNotionConnection.id,
      },
      data: {
        accessToken: notionAccessResponse.accessToken,
        notionBotId: notionAccessResponse.botId,
        notionWorkspaceId: notionAccessResponse.workspaceId,
        notionWorkspaceName: notionAccessResponse.workspaceName ?? '',
        notionWorkspaceIcon: notionAccessResponse.workspaceIcon ?? '',
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
      notionWorkspaceName: notionAccessResponse.workspaceName ?? '',
      notionWorkspaceIcon: notionAccessResponse.workspaceIcon ?? '',
      teamId,
    },
  });
  return apiResponse<PostNotionCallback>(res, {
    successMessage: 'Created new Notion Connection',
  });
};

export default handler;
