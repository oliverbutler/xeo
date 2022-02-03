import { NotionStatusLink, Sprint } from '@prisma/client';
import { prisma } from 'utils/db';
import { ProductBacklog, Ticket } from 'utils/notion/backlog';

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

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

  await prisma.sprintStatusHistory.createMany({
    data: Object.entries(summedAggregateMapping).map(
      ([notionStatusLinkId, points]) => ({
        notionStatusLinkId,
        pointsInStatus: points,
        sprintHistoryId: sprintHistory.id,
      })
    ),
  });
};
