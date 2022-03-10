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
} from '@prisma/client';
import { logger } from 'utils/api';
import { performance } from 'perf_hooks';
import { isNotNullOrUndefined } from '@xeo/utils';

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

const getStatusOfTicket = ({
  links,
  notionStatusName,
}: {
  links: NotionStatusLink[];
  notionStatusName: string | undefined;
}): NotionStatusLink | undefined => {
  const statusLink = links.find(
    (link) => link.notionStatusName === notionStatusName
  );
  return statusLink;
};

// TODO why does this need ALL sprints for a team?
export const getTicketFromNotionObject = ({
  sprints,
  notionConnection,
  notionStatusLinks,
  page,
}: {
  sprints: Sprint[];
  notionConnection: NotionConnection;
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
  const pointsProperty = getPropertyByName(notionConnection.pointsColumnName);
  const statusProperty = getPropertyByName(notionConnection.statusColumnName);
  const sprintProperty = getPropertyByName(notionConnection.sprintColumnName);

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

const getNotionFilterForNotionColumnType = (
  notionConnection: NotionConnection,
  sprint: Sprint
): QueryDatabaseParameters['filter'] => {
  switch (notionConnection.notionColumnType) {
    case NotionColumnType.MULTI_SELECT:
      return {
        property: notionConnection.sprintColumnName,
        multi_select: {
          contains: sprint.notionSprintValue,
        },
      };
    case NotionColumnType.RELATIONSHIP_ID:
      return {
        property: notionConnection.sprintColumnName,
        relation: {
          contains: sprint.notionSprintValue,
        },
      };
    case NotionColumnType.SELECT:
      return {
        property: notionConnection.sprintColumnName,
        select: {
          equals: sprint.notionSprintValue,
        },
      };
  }
};

export const getProductBacklogForSprint = async ({
  notionConnection,
  sprint,
  sprints,
  notionStatusLinks,
}: {
  notionConnection: NotionConnection;
  sprint: Sprint;
  sprints: Sprint[];
  notionStatusLinks: NotionStatusLink[];
}): Promise<ProductBacklog> => {
  const notion = new Client({ auth: notionConnection.accessToken });

  const startTime = performance.now();
  logger.info(
    `getProductBacklogForSprint > Query Notion for  ${sprint.notionSprintValue} in db ${notionConnection.databaseName}`
  );

  const filter = getNotionFilterForNotionColumnType(notionConnection, sprint);

  try {
    const databaseResponse = await notion.databases.query({
      database_id: notionConnection.databaseId,
      filter,
    });

    const endTime = performance.now();
    logger.info(
      `getProductBacklogForSprint > Successfully queried (${
        endTime - startTime
      }ms) Notion for ${sprint.notionSprintValue} in db ${
        notionConnection.databaseName
      }`
    );

    const tickets = databaseResponse.results.map((object) =>
      getTicketFromNotionObject({
        notionConnection: notionConnection,
        page: object,
        notionStatusLinks,
        sprints,
      })
    );

    return {
      tickets,
    };
  } catch (error) {
    logger.error(
      `getProductBacklogForSprint > Failed to query Notion for ${sprint.notionSprintValue} in db ${notionConnection.databaseName}`,
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
