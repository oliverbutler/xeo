import { Client } from '@notionhq/client/build/src';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import {
  Backlog,
  NotionColumnType,
  NotionStatusLink,
  Sprint,
} from '@prisma/client';
import { BacklogWithStatusLinksAndSprints } from 'pages/api/backlog';
import { logger } from 'utils/api';

export type Ticket = {
  notionId: string;
  title: string;
  points: number | null;
  notionStatusLink: NotionStatusLink | undefined;
  sprints: {
    sprint: Sprint | undefined;
    notionSprintSelect: {
      id: string;
      name: string;
      color: string;
    };
  }[];
  icon: TicketIcon | null;
  updatedAt: string;
  notionUrl: string;
};

export type TicketIcon =
  | {
      type: 'image';
      url: string;
    }
  | {
      type: 'emoji';
      emoji: string;
    };

export type NotionDatabaseItem = Extract<
  QueryDatabaseResponse['results'][0],
  { parent: unknown }
>;

export const isNotionDatabaseItem = (
  object: QueryDatabaseResponse['results'][0]
): object is NotionDatabaseItem => {
  return 'parent' in object;
};

export type ProductBacklog = {
  tickets: Ticket[];
};

const notion = new Client({ auth: process.env.NOTION_SECRET });

const getStatusOfTicket = ({
  links,
  notionStatusName,
}: {
  links: BacklogWithStatusLinksAndSprints['notionStatusLinks'];
  notionStatusName: string | undefined;
}): NotionStatusLink | undefined => {
  const statusLink = links.find(
    (link) => link.notionStatusName === notionStatusName
  );
  return statusLink;
};

export const getTicketFromNotionObject = ({
  sprints,
  notionBacklog,
  notionStatusLinks,
  page,
}: {
  sprints: Sprint[];
  notionBacklog: Backlog;
  notionStatusLinks: NotionStatusLink[];
  page: QueryDatabaseResponse['results'][0];
}): Ticket => {
  if (!isNotionDatabaseItem(page)) {
    throw new Error('Not a notion database item');
  }

  const getPropertyByName = (id: string) => page.properties[id];

  const titleProperty = Object.values(page.properties).find(
    (property) => property.id === 'title'
  );
  const pointsProperty = getPropertyByName(notionBacklog.pointsColumnName);
  const statusProperty = getPropertyByName(notionBacklog.statusColumnName);
  const sprintProperty = getPropertyByName(notionBacklog.sprintColumnName);

  const titleValue =
    titleProperty?.type === 'title'
      ? titleProperty.title?.[0]?.plain_text || ''
      : '';
  const pointsValue =
    pointsProperty?.type === 'number' ? pointsProperty.number : null;
  const notionStatusName =
    statusProperty?.type === 'select' ? statusProperty.select?.name : undefined;

  const sprintPropertySelect =
    sprintProperty?.type === 'select' ? sprintProperty.select : null;
  const sprintPropertyMultiSelect =
    sprintProperty?.type === 'multi_select'
      ? sprintProperty.multi_select
      : null;
  const availableSprints = sprintPropertySelect
    ? [sprintPropertySelect]
    : sprintPropertyMultiSelect
    ? sprintPropertyMultiSelect
    : [];

  const matchingSprints = availableSprints.map((notionSprint) => {
    return {
      notionSprintSelect: notionSprint,
      sprint: sprints.find(
        (sprint) => sprint.notionSprintValue === notionSprint.name
      ),
    };
  });

  return {
    notionId: page.id,
    title: titleValue,
    points: pointsValue,
    notionStatusLink: getStatusOfTicket({
      links: notionStatusLinks,
      notionStatusName: notionStatusName,
    }),
    sprints: matchingSprints,
    icon: getIconFromNotionPage(page),
    updatedAt: page.last_edited_time,
    notionUrl: page.url,
  };
};

const getIconFromNotionPage = (page: NotionDatabaseItem): TicketIcon | null => {
  if (!page.icon) {
    return null;
  }

  switch (page.icon.type) {
    case 'emoji':
      return {
        type: 'emoji',
        emoji: page.icon.emoji,
      };
    case 'external':
      return {
        type: 'image',
        url: page.icon.external.url,
      };
    case 'file':
      return {
        type: 'image',
        url: page.icon.file.url,
      };
  }
};

export const getProductBacklogFromNotionDatabase = async (
  notionBacklog: BacklogWithStatusLinksAndSprints
): Promise<ProductBacklog> => {
  const databaseResponse = await notion.databases.query({
    database_id: notionBacklog.databaseId,
  });

  const tickets = databaseResponse.results.map((object) =>
    getTicketFromNotionObject({
      notionBacklog,
      page: object,
      sprints: notionBacklog.sprints,
      notionStatusLinks: notionBacklog.notionStatusLinks,
    })
  );

  return {
    tickets,
  };
};

export const getProductBacklogForSprint = async ({
  notionBacklog,
  sprint,
  sprints,
  notionStatusLinks,
}: {
  notionBacklog: Backlog;
  sprint: Sprint;
  sprints: Sprint[];
  notionStatusLinks: NotionStatusLink[];
}): Promise<ProductBacklog> => {
  const startTime = performance.now();
  logger.info(
    `getProductBacklogForSprint > Query Notion for  ${sprint.notionSprintValue} in db ${notionBacklog.databaseName}`
  );

  const filter =
    notionBacklog.notionColumnType === NotionColumnType.SELECT
      ? {
          select: {
            equals: sprint.notionSprintValue,
          },
        }
      : {
          multi_select: {
            contains: sprint.notionSprintValue,
          },
        };

  const databaseResponse = await notion.databases.query({
    database_id: notionBacklog.databaseId,
    filter: {
      property: notionBacklog.sprintColumnName,
      ...filter,
    },
  });

  const endTime = performance.now();
  logger.info(
    `getProductBacklogForSprint > Successfully queried (${
      endTime - startTime
    }ms) Notion for ${sprint.notionSprintValue} in db ${
      notionBacklog.databaseName
    }`
  );

  const tickets = databaseResponse.results.map((object) =>
    getTicketFromNotionObject({
      notionBacklog,
      page: object,
      notionStatusLinks,
      sprints,
    })
  );

  return {
    tickets,
  };
};
