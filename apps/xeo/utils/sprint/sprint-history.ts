import { NotionStatusLink, Sprint } from '@prisma/client';
import { groupBy } from '@xeo/utils';
import { logger } from 'utils/api';
import { prisma } from 'utils/db';
import {
  getProductBacklogForSprint,
  ProductBacklog,
  Ticket,
} from 'utils/notion/backlog';
import { DataPlotType, getDataForSprintChart } from './chart';

const getAggregatedStatusToPoints = (
  tickets: Ticket[]
): Record<NotionStatusLink['id'] | '', number> => {
  const aggregateTickets = groupBy<Ticket, NotionStatusLink['id'] | ''>(
    tickets,
    (ticket) => ticket?.notionStatusLink?.id ?? ''
  );

  const summedAggregateMapping = Object.entries(aggregateTickets).reduce(
    (previous, [statusId, tickets]) => {
      const summedTicket = tickets.reduce((accPoints, ticket) => {
        accPoints += ticket.points ?? 0;
        return accPoints;
      }, 0);
      previous[statusId] = summedTicket;
      return previous;
    },
    {} as Record<NotionStatusLink['id'], number>
  );

  return summedAggregateMapping;
};

export const saveSprintHistoryForBacklogIfChanged = async (
  productBacklog: ProductBacklog,
  sprint: Sprint
): Promise<boolean> => {
  const lastSprintHistory = await prisma.sprintHistory.findFirst({
    where: {
      sprintId: sprint.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sprintStatusHistory: true,
    },
  });

  if (!lastSprintHistory) {
    await saveSprintHistoryForBacklog(productBacklog, sprint);
    return true;
  }

  const statusPointMapLastHistory =
    lastSprintHistory.sprintStatusHistory.reduce((acc, current) => {
      acc[current.notionStatusLinkId ?? ''] = current.pointsInStatus;
      return acc;
    }, {} as Record<NotionStatusLink['id'], number>);

  const statusPointMapCurrentSprint = getAggregatedStatusToPoints(
    productBacklog.tickets
  );

  const areStatusPointMapsEqual = Object.entries(
    statusPointMapLastHistory
  ).every(([statusId, points]) => {
    return points === statusPointMapCurrentSprint[statusId];
  });

  if (!areStatusPointMapsEqual) {
    await saveSprintHistoryForBacklog(productBacklog, sprint);
    return true;
  }

  return false;
};

export const saveSprintHistoryForBacklog = async (
  productBacklog: ProductBacklog,
  sprint: Sprint
): Promise<void> => {
  const { tickets } = productBacklog;

  const aggregates = getAggregatedStatusToPoints(tickets);

  const sprintHistory = await prisma.sprintHistory.create({
    data: {
      sprintId: sprint.id,
      timestamp: new Date(),
      sprintStatusHistory: {
        createMany: {
          data: Object.entries(aggregates).map(
            ([notionStatusLinkId, points]) => ({
              notionStatusLinkId:
                notionStatusLinkId === '' ? null : notionStatusLinkId, // save as nullable if no status found for those points
              pointsInStatus: points,
            })
          ),
        },
      },
    },
  });

  logger.info(
    `Saved sprint history ${sprintHistory.id} for sprint ${sprint.id}`
  );
};

/**
 * Calls the Notion API, looks for differences in Sprint History and saves them to the DB
 *
 * @param sprintId
 * @returns
 */
export const updateSprintHistoryIfChanged = async (
  sprintId: string
): Promise<boolean> => {
  logger.info(
    `updateSprintHistoryIfChanged > searching for sprint ${sprintId}`
  );
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      team: {
        select: {
          sprints: true,
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
    throw new Error('Sprint not found');
  }

  if (!sprint.team?.notionDatabase || !sprint.team?.notionConnection) {
    throw new Error('Team has no Notion connection and Database');
  }

  const productBacklog = await getProductBacklogForSprint({
    notionConnection: sprint.team.notionConnection,
    notionDatabase: sprint.team.notionDatabase,
    sprint,
    sprints: sprint.team.sprints,
    notionStatusLinks: sprint.team.notionDatabase.notionStatusLinks,
  });

  const updatedHistory = await saveSprintHistoryForBacklogIfChanged(
    productBacklog,
    sprint
  );

  logger.info(
    updatedHistory
      ? `updateSprintHistoryIfChanged > Sprint history updated for sprint ${sprint.id}`
      : `updateSprintHistoryIfChanged > Sprint history ${sprint.id} already up to date`
  );

  return updatedHistory;
};

/**
 * Used for [id]/history endpoint and for [id]/embed ISG page
 */
export const getSprintAndPlotDataForPage = async (
  sprintId: string
): Promise<{
  sprint: Sprint;
  sprintHistoryPlotData: DataPlotType[];
} | null> => {
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      team: {
        select: {
          notionDatabase: {
            select: {
              notionStatusLinks: true,
            },
          },
        },
      },
      sprintHistory: {
        include: {
          sprintStatusHistory: true,
        },
      },
    },
  });

  if (!sprint || !sprint.team.notionDatabase) {
    return null;
  }

  const sprintHistoryPlotData = getDataForSprintChart(
    sprint,
    sprint.sprintHistory,
    sprint.team.notionDatabase.notionStatusLinks
  );

  // Remove backlog and sprintHistory from the response to avoid sending unnecessary data
  const { team, sprintHistory, ...restSprint } = sprint;

  return {
    sprint: restSprint,
    sprintHistoryPlotData,
  };
};
