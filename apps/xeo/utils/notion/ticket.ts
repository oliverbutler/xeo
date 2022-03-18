import { Client } from '@notionhq/client';
import { NotionConnection, NotionDatabase, Sprint } from '@prisma/client';
import { logger } from 'utils/api';
import { isNotionDatabaseItem } from './backlog';

export const createLinkBetweenTickets = async (
  sourceTicketId: string,
  targetTicketId: string,
  notionDatabase: NotionDatabase,
  notionConnection: NotionConnection
) => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const parentRelationColumnName = notionDatabase.parentRelationColumnName;

  if (!parentRelationColumnName) {
    throw new Error('Parent relation column name is not defined');
  }

  const currentNotionPage = await notion.pages.retrieve({
    page_id: sourceTicketId,
  });

  if (!isNotionDatabaseItem(currentNotionPage)) {
    throw new Error('Not a notion database item');
  }

  const parentRelationProperty =
    currentNotionPage.properties[parentRelationColumnName];

  if (parentRelationProperty.type !== 'relation') {
    throw new Error(
      `Parent relation column "${parentRelationColumnName}" is not a relation`
    );
  }

  const existingTargetRelations = parentRelationProperty.relation.map(
    (relation) => relation.id
  );

  if (existingTargetRelations.includes(targetTicketId)) {
    logger.warn(
      `Ticket ${sourceTicketId} already has relation to ${targetTicketId}`
    );
    return;
  }

  const newTargetRelations = [...existingTargetRelations, targetTicketId];

  await notion.pages.update({
    page_id: sourceTicketId,
    properties: {
      [parentRelationColumnName]: {
        relation: newTargetRelations.map((id) => ({ id })),
      },
    },
  });
};

export const removeLinkBetweenTickets = async (
  sourceTicketId: string,
  targetTicketId: string,
  notionDatabase: NotionDatabase,
  notionConnection: NotionConnection
) => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const parentRelationColumnName = notionDatabase.parentRelationColumnName;

  if (!parentRelationColumnName) {
    throw new Error('Parent relation column name is not defined');
  }

  const currentNotionPage = await notion.pages.retrieve({
    page_id: sourceTicketId,
  });

  if (!isNotionDatabaseItem(currentNotionPage)) {
    throw new Error('Not a notion database item');
  }

  const parentRelationProperty =
    currentNotionPage.properties[parentRelationColumnName];

  if (parentRelationProperty.type !== 'relation') {
    throw new Error(
      `Parent relation column "${parentRelationColumnName}" is not a relation`
    );
  }

  const existingTargetRelations = parentRelationProperty.relation.map(
    (relation) => relation.id
  );

  if (!existingTargetRelations.includes(targetTicketId)) {
    const error = `Ticket ${sourceTicketId} doesn't have relation to the requested ticket to delete ${targetTicketId}`;
    logger.warn(error);
    throw new Error(error);
  }

  const newTargetRelations = existingTargetRelations.filter(
    (id) => id !== targetTicketId
  );

  await notion.pages.update({
    page_id: sourceTicketId,
    properties: {
      [parentRelationColumnName]: {
        relation: newTargetRelations.map((id) => ({ id })),
      },
    },
  });
};
