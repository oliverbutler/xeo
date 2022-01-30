import { Client } from '@notionhq/client/build/src';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionBacklog } from '@prisma/client';

export type Ticket = {
  notionId: string;
  title: string;
  points: number;
  status: string;
  sprint: string;
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

export const getTicketFromNotionObject = (
  notionBacklog: NotionBacklog,
  page: QueryDatabaseResponse['results'][0]
): Ticket => {
  if (!isNotionDatabaseItem(page)) {
    throw new Error('Not a notion database item');
  }

  const properties = Object.values(page.properties);

  const getPropertyById = (id: string) =>
    properties.find((property) => property.id === id);

  const title = getPropertyById('title');
  const points = getPropertyById(notionBacklog.pointsColumnId);
  const status = getPropertyById(notionBacklog.statusColumnId);
  const sprint = getPropertyById(notionBacklog.sprintColumnId);

  const titleValue =
    title.type === 'title' ? title.title[0].plain_text : undefined;
  const pointsValue = points.type === 'number' ? points.number : undefined;
  const statusValue = status.type === 'select' ? status.select.name : undefined;
  const sprintValue = sprint.type === 'select' ? sprint.select.name : undefined;

  return {
    notionId: page.id,
    title: titleValue,
    points: pointsValue,
    status: statusValue,
    sprint: sprintValue,
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
  notionBacklog: NotionBacklog
): Promise<ProductBacklog> => {
  const databaseResponse = await notion.databases.query({
    database_id: notionBacklog.databaseId,
  });

  const tickets = databaseResponse.results.map((object) =>
    getTicketFromNotionObject(notionBacklog, object)
  );

  return {
    tickets,
  };
};
