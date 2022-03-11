import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { apiError, APIRequest, apiResponse, parseAPIRequest } from 'utils/api';
import { addMemberToTeam, getUserRoleInTeam } from 'utils/db/team/adapter';

export type PostCreateTeamMember = APIRequest<
  {
    userId: string;
  },
  {
    message: string;
  }
>;

const schema: PostCreateTeamMember['joiBodySchema'] = Joi.object({
  userId: Joi.string().required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const callingUserId = session.id;
  const teamId = req.query.teamId as string;

  if (!teamId) {
    return apiError(res, { message: 'Missing required query parameters' });
  }

  const callingUserRole = await getUserRoleInTeam(callingUserId, teamId);

  if (!callingUserRole) {
    return apiError(res, { message: 'User is not a member of the team' });
  }

  if (callingUserRole !== 'OWNER' && callingUserRole !== 'ADMIN') {
    return apiError(res, {
      message: "User isn't an owner or admin of the team",
    });
  }

  if (req.method === 'POST') {
    return postHandler(req, res, teamId);
  }
  return res.status(400).json({ message: 'Invalid request method' });
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) => {
  const { body, error } = parseAPIRequest(req, schema);

  if (error) {
    return apiError(res, error);
  }

  await addMemberToTeam(teamId, body.userId);

  return apiResponse<PostCreateTeamMember>(res, {
    message: 'Successfully added Member',
  });
};

export default handler;
