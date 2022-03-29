import { Client } from '@notionhq/client/build/src';
import {
  GetDatabaseResponse,
  QueryDatabaseResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import {
  NotionConnection,
  NotionColumnType,
  NotionStatusLink,
  Sprint,
  NotionDatabase,
} from '@prisma/client';
import { logger } from 'utils/api';
import { performance } from 'perf_hooks';
import { isNotNullOrUndefined } from '@xeo/utils';
import { prisma } from 'utils/db';
import {
  getNotionDatabaseItemPropertyByIdOrName,
  NotionDatabaseItemProperty,
} from './notionTicket';

export type Ticket = {
  notionId: string;
  title: string;
  points: number | null;
  notionStatusLink: NotionStatusLink | undefined;
  parentTickets: string[] | undefined;
  iconString: string | null;
  updatedAt: string;
  notionUrl: string;
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

// TODO as we have a mix of names and IDs right now, this is a bit of a hack
const getStatusOfTicket = ({
  links,
  notionStatusName,
}: {
  links: NotionStatusLink[];
  notionStatusName:
    | { id: string | undefined; name: string | undefined }
    | undefined;
}): NotionStatusLink | undefined => {
  const statusLink = links.find(
    (link) =>
      link.notionStatusName === notionStatusName?.name ||
      link.id === notionStatusName?.id
  );
  return statusLink;
};

export const getTicketFromNotionObject = ({
  notionDatabase,
  notionStatusLinks,
  page,
}: {
  notionDatabase: NotionDatabase;
  notionStatusLinks: NotionStatusLink[];
  page: QueryDatabaseResponse['results'][0];
}): Ticket => {
  if (!isNotionDatabaseItem(page)) {
    throw new Error('Not a notion database item');
  }

  const titleProperty = Object.values(page.properties).find(
    (property) => property.id === 'title'
  );

  const pointsProperty = getNotionDatabaseItemPropertyByIdOrName(
    page.properties,
    notionDatabase.pointsColumnName
  );
  const statusProperty = getNotionDatabaseItemPropertyByIdOrName(
    page.properties,
    notionDatabase.statusColumnName
  );
  const parentRelationsProperty = notionDatabase.parentRelationColumnName
    ? getNotionDatabaseItemPropertyByIdOrName(
        page.properties,
        notionDatabase.parentRelationColumnName
      )
    : null;

  const titleValue =
    titleProperty?.type === 'title'
      ? titleProperty.title.reduce(
          (acc, section) => acc + section.plain_text,
          ''
        )
      : '';

  const pointsValue =
    pointsProperty?.type === 'number' ? pointsProperty.number : null;

  const notionStatusOption =
    statusProperty?.type === 'select'
      ? { id: statusProperty.select?.id, name: statusProperty.select?.name }
      : undefined;

  const parentTickets =
    parentRelationsProperty?.type === 'relation'
      ? parentRelationsProperty.relation?.map((relation) => relation.id)
      : undefined;

  return {
    notionId: page.id,
    title: titleValue,
    points: pointsValue,
    notionStatusLink: getStatusOfTicket({
      links: notionStatusLinks,
      notionStatusName: notionStatusOption,
    }),
    iconString: getIconFromNotionPage(page),
    updatedAt: page.last_edited_time,
    notionUrl: page.url,
    parentTickets,
  };
};

const getIconFromNotionPage = (page: NotionDatabaseItem): string | null => {
  if (!page.icon) {
    return null;
  }

  switch (page.icon.type) {
    case 'emoji':
      return page.icon.emoji;
    case 'external':
      return page.icon.external.url;
    case 'file':
      return page.icon.file.url;
  }
};

const getNotionFilterForNotionColumnType = (
  notionDatabase: NotionDatabase,
  sprint: Sprint
): QueryDatabaseParameters['filter'] => {
  switch (notionDatabase.notionColumnType) {
    case NotionColumnType.MULTI_SELECT:
      return {
        property: notionDatabase.sprintColumnName,
        multi_select: {
          contains: sprint.notionSprintValue,
        },
      };
    case NotionColumnType.RELATIONSHIP_ID:
      return {
        property: notionDatabase.sprintColumnName,
        relation: {
          contains: sprint.notionSprintValue,
        },
      };
    case NotionColumnType.SELECT:
      return {
        property: notionDatabase.sprintColumnName,
        select: {
          equals: sprint.notionSprintValue,
        },
      };
  }
};

export const getProductBacklogForSprint = async ({
  notionDatabase,
  notionConnection,
  sprint,
  notionStatusLinks,
}: {
  notionDatabase: NotionDatabase;
  notionConnection: NotionConnection;
  sprint: Sprint;
  notionStatusLinks: NotionStatusLink[];
}): Promise<ProductBacklog> => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const startTime = performance.now();
  logger.info(
    `getProductBacklogForSprint > Query Notion for  ${sprint.notionSprintValue} in db ${notionDatabase.databaseName}`
  );

  const filter = getNotionFilterForNotionColumnType(notionDatabase, sprint);

  try {
    const databaseResponse = await notion.databases.query({
      database_id: notionDatabase.databaseId,
      filter,
    });

    const endTime = performance.now();
    logger.info(
      `getProductBacklogForSprint > Successfully queried (${
        endTime - startTime
      }ms) Notion for ${sprint.notionSprintValue} in db ${
        notionDatabase.databaseName
      }`
    );

    const tickets = databaseResponse.results.map((object) =>
      getTicketFromNotionObject({
        notionDatabase,
        page: object,
        notionStatusLinks,
      })
    );

    return {
      tickets,
    };
  } catch (error) {
    logger.error(
      `getProductBacklogForSprint > Failed to query Notion for ${sprint.notionSprintValue} in db ${notionDatabase.databaseName}`,
      error
    );
    throw new Error(
      'Failed to query Notion for your Backlog, please try again later'
    );
  }
};

export type NotionAPIColumnType = GetDatabaseResponse['properties'][0]['type'];

export const getAvailableColumnOptions = async ({
  accessToken,
  databaseId,
  columnName,
  searchString,
}: {
  accessToken: string;
  databaseId: string;
  columnName: string;
  searchString: string;
}): Promise<{
  type: NotionColumnType;
  options: { label: string; value: string }[];
}> => {
  const notion = new Client({ auth: accessToken });

  const databaseResponse = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const column = databaseResponse.properties[columnName];

  if (!column) {
    throw new Error(
      `Could not find column ${columnName} in database ${databaseId}`
    );
  }

  if (column.type === 'select') {
    return {
      type: NotionColumnType.SELECT,
      options: column.select.options.map((option) => ({
        label: option.name,
        value: option.name, // Notion uses the name "PEX 22-04" as the properties key
      })),
    };
  }

  if (column.type === 'multi_select') {
    return {
      type: NotionColumnType.MULTI_SELECT,
      options: column.multi_select.options.map((option) => ({
        label: option.name,
        value: option.name, // Notion uses the name "PEX 22-04" as the properties key
      })),
    };
  }

  if (column.type !== 'relation') {
    throw new Error(
      `Column ${columnName} in database ${databaseId}, ${column.type} is not supported`
    );
  }

  // Find options for relation
  const relationDatabaseResponse = await notion.databases.query({
    database_id: column.relation.database_id,
    filter: {
      property: 'title',
      title: {
        contains: searchString,
      },
    },
  });

  const relationColumn = relationDatabaseResponse.results.map((result) => {
    if (!isNotionDatabaseItem(result)) {
      throw new Error('Not a notion database item');
    }

    const titleColumn = Object.values(result.properties).find(
      (p) => p.type === 'title'
    );

    return titleColumn?.type === 'title' && titleColumn.title.length > 0
      ? { label: titleColumn.title[0].plain_text, value: result.id }
      : null;
  });

  return {
    type: NotionColumnType.RELATIONSHIP_ID,
    options: relationColumn.filter(isNotNullOrUndefined),
  };
};

export const getAllTicketsInSprint = async (
  sprintId: string
): Promise<Ticket[]> => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      team: {
        select: {
          notionConnection: true,
          notionDatabase: {
            include: {
              notionStatusLinks: true,
            },
          },
        },
      },
    },
  });

  if (!sprint) {
    logger.error('updateSprintHistoryIfChanged > Sprint not found');
    throw new Error('Sprint not found');
  }

  if (!sprint.team?.notionDatabase || !sprint.team?.notionConnection) {
    logger.error(
      'updateSprintHistoryIfChanged > Team has no Notion connection and Database'
    );
    throw new Error('Team has no Notion connection and Database');
  }

  const { tickets } = await getProductBacklogForSprint({
    notionConnection: sprint.team.notionConnection,
    notionDatabase: sprint.team.notionDatabase,
    sprint,
    notionStatusLinks: sprint.team.notionDatabase.notionStatusLinks,
  });

  return tickets;
};
