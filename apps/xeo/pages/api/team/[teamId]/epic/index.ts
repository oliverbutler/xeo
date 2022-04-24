import { NotionEpic } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { createNotionEpic } from 'utils/db/epic/adapter';
import { getNotionDatabase } from 'utils/db/notionDatabase/adapter';
import { getUserRoleInTeam } from 'utils/db/team/adapter';

export type PostCreateNotionEpicRequest = APIRequest<
  {
    input: {
      notionEpicName: string;
      notionEpicId: string;
      notionEpicIcon: string | null;
    };
  },
  {
    notionEpic: NotionEpic;
  }
>;

const postSchema: PostCreateNotionEpicRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    notionEpicName: Joi.string().required(),
    notionEpicId: Joi.string().required(),
    notionEpicIcon: Joi.string().required(),
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  const teamId = req.query.teamId as string;

  switch (req.method) {
    case 'POST':
      return await postHandler(req, res, teamId, userId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userId: string
) => {
  const { body: bodyPost, error: errorPost } = parseAPIRequest(req, postSchema);

  if (errorPost || !bodyPost) {
    return apiError(res, { message: errorPost?.message ?? '' }, 400);
  }

  const userRole = await getUserRoleInTeam(userId, teamId);

  if (!userRole) {
    return apiError(res, { message: 'User is not a member of this team' }, 403);
  }

  const database = await getNotionDatabase(teamId);

  if (!database) {
    return apiError(res, { message: 'Team not found' }, 404);
  }

  const notionEpic = await createNotionEpic({
    ...bodyPost.input,
    notionDatabaseId: database.id,
  });

  return apiResponse<PostCreateNotionEpicRequest>(res, {
    notionEpic,
  });
};

export default handler;
