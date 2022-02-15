import { NotionConnection } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIRequest, parseAPIRequest } from 'utils/api';
import Joi from 'joi';
import { prisma } from 'utils/db';
import { Client } from '@notionhq/client/build/src';
import { withSentry } from '@sentry/nextjs';

export type PostCreateNotionConnection = APIRequest<
  {
    name: string;
    secretKey: string;
  },
  {
    notionConnection: NotionConnection;
  }
>;

const schema: PostCreateNotionConnection['joiBodySchema'] = Joi.object({
  name: Joi.string().required(),
  secretKey: Joi.string().required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const userId = session?.id as string;

  const { body, error } = parseAPIRequest(req, schema);

  if (error || !body) {
    return res.status(400).json({ message: error?.message });
  }

  try {
    const notion = new Client({ auth: body.secretKey });
    await notion.users.me({});
  } catch {
    return res.status(400).json({ message: 'Invalid secret key' });
  }

  const notionConnection = await prisma.notionConnection.create({
    data: {
      secretKey: body.secretKey,
      connectionName: body.name,
      createdByUserId: userId,
    },
  });

  const returnValue: PostCreateNotionConnection['response'] = {
    notionConnection,
  };

  return res.status(201).json(returnValue);
};

export default withSentry(handler);
