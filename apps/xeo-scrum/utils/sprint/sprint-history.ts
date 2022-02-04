import { NotionStatusLink, Sprint } from '@prisma/client';
import { logger } from 'utils/api';
import { prisma } from 'utils/db';
import {
  getProductBacklogForSprint,
  ProductBacklog,
  Ticket,
} from 'utils/notion/backlog';

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

const getAggregatedStatusToPoints = (
  tickets: Ticket[]
): Record<NotionStatusLink['id'], number> => {
  const aggregateTickets = groupBy<Ticket, NotionStatusLink['id']>(
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
      acc[current.notionStatusLinkId] = current.pointsInStatus;
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

  const sprintHistory = await prisma.sprintHistory.create({
    data: {
      sprintId: sprint.id,
      timestamp: new Date(),
    },
  });

  const aggregates = getAggregatedStatusToPoints(tickets);

  await prisma.sprintStatusHistory.createMany({
    data: Object.entries(aggregates).map(([notionStatusLinkId, points]) => ({
      notionStatusLinkId,
      pointsInStatus: points,
      sprintHistoryId: sprintHistory.id,
    })),
  });
};

export const getSprintHistory = async (sprintId: string) => {
  console.log('looking for sprint');
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      backlog: {
        include: {
          notionStatusLinks: true,
          sprints: true,
        },
      },
    },
  });

  console.log('found sprint');

  if (!sprint) {
    throw new Error('Sprint not found');
  }

  const productBacklog = await getProductBacklogForSprint({
    notionBacklog: sprint.backlog,
    sprint,
    sprints: sprint.backlog.sprints,
    notionStatusLinks: sprint.backlog.notionStatusLinks,
  });

  const updatedHistory = await saveSprintHistoryForBacklogIfChanged(
    productBacklog,
    sprint
  );

  if (updatedHistory) {
    logger.info(
      `GET /backlog/sprint > Saved sprint history for sprint ${sprint.id}`
    );
  } else {
    logger.info(
      `GET /backlog/sprint > Sprint history ${sprint.id} already up to date`
    );
  }

  const sprintHistory = await prisma.sprintHistory.findMany({
    where: {
      sprintId,
    },
    include: {
      sprintStatusHistory: true,
    },
  });

  return {
    sprintHistory,
    sprint,
    notionStatusLinks: sprint.backlog.notionStatusLinks,
  };
};
