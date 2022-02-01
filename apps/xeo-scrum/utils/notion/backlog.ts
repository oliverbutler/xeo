import { Client } from '@notionhq/client/build/src';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { Backlog, BacklogStatus, Sprint } from '@prisma/client';
import { BacklogWithStatusLinksAndSprints } from 'pages/api/backlog';

export type Ticket = {
  notionId: string;
  title: string;
  points: number | null;
  status: BacklogStatus;
  notionSprintSelect: {
    id: string;
    name: string;
    color: string;
  } | null;
  sprint: Sprint | undefined;
  icon: TicketIcon | null;
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

const getBacklogStatusForTicket = ({
  links,
  notionStatusId,
}: {
  links: BacklogWithStatusLinksAndSprints['notionStatusLinks'];
  notionStatusId: string | undefined;
}): BacklogStatus => {
  const statusLink = links.find(
    (link) => link.notionStatusId === notionStatusId
  );
  if (!statusLink) {
    return BacklogStatus.UNKNOWN;
  }
  return statusLink.status;
};

export const getTicketFromNotionObject = ({
  notionBacklog,
  page,
}: {
  notionBacklog: BacklogWithStatusLinksAndSprints;
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
      ? titleProperty.title[0].plain_text
      : undefined;
  const pointsValue =
    pointsProperty?.type === 'number' ? pointsProperty.number : null;
  const statusId =
    statusProperty?.type === 'select' ? statusProperty.select?.id : undefined;
  const sprintPropertySelect =
    sprintProperty?.type === 'select' ? sprintProperty.select ?? null : null;

  if (!titleValue) {
    throw new Error('Missing Title Value');
  }

  const sprint = notionBacklog.sprints.find(
    (sprint) => sprint.notionSprintValue === sprintPropertySelect?.name
  );

  return {
    notionId: page.id,
    title: titleValue,
    points: pointsValue,
    status: getBacklogStatusForTicket({
      links: notionBacklog.notionStatusLinks,
      notionStatusId: statusId,
    }),
    sprint,
    notionSprintSelect: sprintPropertySelect,
    icon: getIconFromNotionPage(page),
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
    getTicketFromNotionObject({ notionBacklog, page: object })
  );

  return {
    tickets,
  };
};

export const getProductBacklogForSprint = async ({
  notionBacklog,
  sprintColumnName,
  notionSprintValue,
}: {
  notionBacklog: BacklogWithStatusLinksAndSprints;
  sprintColumnName: Backlog['sprintColumnName'];
  notionSprintValue: Sprint['notionSprintValue'];
}): Promise<ProductBacklog> => {
  const databaseResponse = await notion.databases.query({
    database_id: notionBacklog.databaseId,
    filter: {
      property: sprintColumnName,
      select: {
        equals: notionSprintValue,
      },
    },
  });

  const tickets = databaseResponse.results.map((object) =>
    getTicketFromNotionObject({ notionBacklog, page: object })
  );

  return {
    tickets,
  };
};
