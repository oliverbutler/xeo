import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { CreateUserMetadata, UserMetadata, UserRole } from 'utils/db/db';
import { createUserMetadata, getUserMetadata } from 'utils/db/userMetadata';

export type PostCreateUserRequest = APIRequest<
  {
    input: CreateUserMetadata;
  },
  {
    user: UserMetadata;
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
  const user = await getUserMetadata(userId);

  if (user) {
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

  return apiResponse<PostCreateUserRequest>(res, { user: result });
};
