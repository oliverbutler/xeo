import {
  NotionStatusLink,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
} from '@prisma/client';
import dayjs from 'dayjs';
import { isDeveloperWithCapacityArray } from './utils';

export enum DataPlotLine {
  SCOPE = 'Scope',
  POINTS_LEFT = 'Done',
  POINTS_NOT_STARTED = 'In Progress',
  POINTS_DONE_INC_VALIDATE = 'To Validate',
}

export type DataPlotType = {
  time: number;
} & {
  [key in DataPlotLine]: number;
};

export type SprintHistoryWithStatusHistory = SprintHistory & {
  sprintStatusHistory: SprintStatusHistory[];
};

export const getDaysArray = function (start: Date, end: Date): Date[] {
  const s = new Date(start);
  const e = new Date(end);
  const a: Date[] = [];
  for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }
  return a;
};

export const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export const getBusinessDaysArray = (start: Date, end: Date): Date[] => {
  const days = getDaysArray(start, end);
  return days.filter(isBusinessDay);
};

/**
 * From a sprint, calculate the expected team capacity per day of the sprint (ex weekends)
 */
export const getSprintCapacityPerDay = (
  sprint: Pick<
    Sprint,
    'startDate' | 'endDate' | 'teamSpeed' | 'sprintDevelopersAndCapacity'
  >
): { day: Date; capacity: number }[] => {
  const { startDate, endDate, teamSpeed, sprintDevelopersAndCapacity } = sprint;

  if (!isDeveloperWithCapacityArray(sprintDevelopersAndCapacity)) {
    throw new Error(
      'getSprintCapacityPerDay > Sprint developers and capacity must be an array of objects'
    );
  }

  const sprintDays = getBusinessDaysArray(startDate, endDate);

  const capacityPerDay: { day: Date; capacity: number }[] = sprintDays.map(
    (day, dayIndex) => {
      const devDaysThatDay: number = sprintDevelopersAndCapacity.reduce(
        (acc, dev) => acc + dev.capacity[dayIndex],
        0
      );

      return {
        day,
        capacity: Math.round(devDaysThatDay * teamSpeed * 10) / 10,
      };
    }
  );

  return capacityPerDay;
};

export const getDataForSprintChart = (
  sprint: Sprint,
  sprintHistory: SprintHistoryWithStatusHistory[],
  notionStatusLinks: NotionStatusLink[]
) => {
  const capacityPerDay = getSprintCapacityPerDay(sprint);

  const toalCapacity = capacityPerDay.reduce(
    (acc, { capacity }) => acc + capacity,
    0
  );

  const plotData: DataPlotType[] = sprintHistory
    .map((historyEvent) => {
      const scope = historyEvent.sprintStatusHistory.reduce((acc, history) => {
        acc += history.pointsInStatus;
        return acc;
      }, 0);

      // Count points which are in BacklogStatus.DONE
      const pointsDone = historyEvent.sprintStatusHistory.reduce(
        (acc, history) => {
          const notionStatusLink = notionStatusLinks.find(
            (status) => status.id === history.notionStatusLinkId
          );

          if (notionStatusLink?.status === 'DONE') {
            acc += history.pointsInStatus;
          }

          return acc;
        },
        0
      );

      const pointsDoneIncludingDoing = historyEvent.sprintStatusHistory.reduce(
        (acc, history) => {
          const notionStatusLink = notionStatusLinks.find(
            (status) => status.id === history.notionStatusLinkId
          );

          if (
            notionStatusLink?.status === 'DONE' ||
            notionStatusLink?.status === 'IN_PROGRESS'
          ) {
            acc += history.pointsInStatus;
          }

          return acc;
        },
        0
      );

      const pointsDoneIncludingToValidate =
        historyEvent.sprintStatusHistory.reduce((acc, history) => {
          const notionStatusLink = notionStatusLinks.find(
            (status) => status.id === history.notionStatusLinkId
          );

          if (
            notionStatusLink?.status === 'DONE' ||
            notionStatusLink?.notionStatusName === 'TO VALIDATE'
          ) {
            acc += history.pointsInStatus;
          }

          return acc;
        }, 0);

      const pointsLeft = scope - pointsDone;
      const pointsLeftExDoing = scope - pointsDoneIncludingDoing;
      const pointsLeftExToValidate = scope - pointsDoneIncludingToValidate;

      return {
        time: dayjs(historyEvent.timestamp).unix(),
        [DataPlotLine.SCOPE]: scope,
        [DataPlotLine.POINTS_LEFT]: pointsLeft,
        [DataPlotLine.POINTS_NOT_STARTED]: pointsLeftExDoing,
        [DataPlotLine.POINTS_DONE_INC_VALIDATE]: pointsLeftExToValidate,
      };
    })
    .sort((a, b) => a.time - b.time);

  return plotData;
};
