import { UserMetadata, UserRole } from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import {
  createUserMetadata,
  CreateUserMetadata,
  getUserWithMetadata,
} from 'utils/db/user/adapter';

export type PostCreateUserRequest = APIRequest<
  {
    input: CreateUserMetadata;
  },
  {
    userMetadata: UserMetadata;
  }
>;

const postSchema: PostCreateUserRequest['joiBodySchema'] = Joi.object({
  input: Joi.object({
    role: Joi.string()
      .valid(...Object.values(UserRole))
      .required(),
    preferredName: Joi.string().required(),
  }).required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return apiError(res, { message: 'Not authenticated' }, 401);
  }

  const userId = session.id;

  if (req.method === 'POST') {
    return postHandler(req, res, userId);
  }

  return apiError(res, { message: 'Method not allowed' }, 405);
};

export default handler;

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  const user = await getUserWithMetadata(userId);

  if (!user) {
    return apiError(res, { message: 'User not found' }, 404);
  }

  if (user?.metadata) {
    return apiError(res, { message: 'You already have User Metadata' }, 400);
  }

  const { body, error } = parseAPIRequest(req, postSchema);

  if (error || !body) {
    return apiError(res, { message: error?.message ?? '' }, 400);
  }

  const result = await createUserMetadata(userId, body.input);

  if (!result) {
    return apiError(res, { message: 'Failed to create User Metadata' }, 500);
  }

  return apiResponse<PostCreateUserRequest>(res, { userMetadata: result });
};
