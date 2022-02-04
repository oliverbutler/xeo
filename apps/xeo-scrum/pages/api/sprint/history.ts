import {
  NotionStatusLink,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
} from '@prisma/client';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getSprintHistory } from 'utils/sprint/sprint-history';

export type GetSprintHistoryRequest = {
  method: 'GET';
  query: {
    sprintId: string;
  };
  responseBody: {
    sprint: Sprint;
    notionStatusLinks: NotionStatusLink[];
    sprintHistory: (SprintHistory & {
      sprintStatusHistory: SprintStatusHistory[];
    })[];
  };
};

const schema = Joi.object<GetSprintHistoryRequest['query']>({
  sprintId: Joi.string().required(),
});

export default async function getSprintHistoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { sprintId } = value;

  // FIXME:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sprintHistory = await getSprintHistory(sprintId, session.id);

  const returnValue: GetSprintHistoryRequest['responseBody'] = {
    sprintHistory: sprintHistory.sprintHistory,
    sprint: sprintHistory.sprint,
    notionStatusLinks: sprintHistory.notionStatusLinks,
  };

  return res.status(200).json(returnValue);
}
