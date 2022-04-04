import { Client } from '@notionhq/client';
import { NotionConnection, NotionDatabase, Sprint } from '@prisma/client';
import { logger } from 'utils/api';
import { isNotionDatabaseItem } from './backlog';
import {
  getNotionDatabaseItemPropertyByIdOrName,
  getNotionDatabasePropertyByIdOrName,
} from './notionTicket';

export const createLinkBetweenTickets = async (
  childTicketId: string,
  parentTicketId: string,
  notionDatabase: NotionDatabase,
  notionConnection: NotionConnection
) => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const parentRelationColumnName = notionDatabase.parentRelationColumnName;

  if (!parentRelationColumnName) {
    throw new Error('Parent relation column name is not defined');
  }

  const currentNotionPage = await notion.pages.retrieve({
    page_id: childTicketId,
  });

  if (!isNotionDatabaseItem(currentNotionPage)) {
    throw new Error('Not a notion database item');
  }

  const parentRelationProperty = getNotionDatabaseItemPropertyByIdOrName(
    currentNotionPage.properties,
    parentRelationColumnName
  );

  if (!parentRelationProperty || parentRelationProperty.type !== 'relation') {
    throw new Error(
      `Parent relation column "${parentRelationColumnName}" is not a relation`
    );
  }

  const existingTargetRelations = parentRelationProperty.relation.map(
    (relation) => relation.id
  );

  if (existingTargetRelations.includes(parentTicketId)) {
    logger.warn(
      `Ticket ${childTicketId} already has relation to ${parentTicketId}`
    );
    return;
  }

  const newTargetRelations = [...existingTargetRelations, parentTicketId];

  logger.info(`Creating link between ${childTicketId} and ${parentTicketId}`);

  await notion.pages.update({
    page_id: childTicketId,
    properties: {
      [parentRelationColumnName]: {
        relation: newTargetRelations.map((id) => ({ id })),
      },
    },
  });
};

export const removeLinkBetweenTickets = async (
  childTicketId: string,
  parentTicketId: string,
  notionDatabase: NotionDatabase,
  notionConnection: NotionConnection
) => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const parentRelationColumnName = notionDatabase.parentRelationColumnName;

  if (!parentRelationColumnName) {
    throw new Error('Parent relation column name is not defined');
  }

  const currentNotionPage = await notion.pages.retrieve({
    page_id: childTicketId,
  });

  if (!isNotionDatabaseItem(currentNotionPage)) {
    throw new Error('Not a notion database item');
  }

  const parentRelationProperty = getNotionDatabaseItemPropertyByIdOrName(
    currentNotionPage.properties,
    parentRelationColumnName
  );

  if (!parentRelationProperty || parentRelationProperty.type !== 'relation') {
    throw new Error(
      `Parent relation column "${parentRelationColumnName}" is not a relation`
    );
  }

  const existingTargetRelations = parentRelationProperty.relation.map(
    (relation) => relation.id
  );

  if (!existingTargetRelations.includes(parentTicketId)) {
    const error = `Ticket ${childTicketId} doesn't have relation to the requested ticket to delete ${parentTicketId}`;
    logger.warn(error);
    throw new Error(error);
  }

  const newTargetRelations = existingTargetRelations.filter(
    (id) => id !== parentTicketId
  );

  logger.info(`Removing link between ${childTicketId} and ${parentTicketId}`);

  await notion.pages.update({
    page_id: childTicketId,
    properties: {
      [parentRelationColumnName]: {
        relation: newTargetRelations.map((id) => ({ id })),
      },
    },
  });
};
