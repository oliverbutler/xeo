import {
  BacklogStatus,
  NotionStatusLink,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
} from '@prisma/client';
import dayjs from 'dayjs';
import { isDeveloperWithCapacityArray } from './utils';

export enum DataPlotLine {
  CAPACITY = 'Capacity',
  POINTS_LEFT = 'Done',
  POINTS_DONE_INC_VALIDATE = 'To Validate',
  EXPECTED_POINTS = 'Expected',
}

export type DataPlotType = {
  time: number;
} & {
  [key in DataPlotLine]?: number;
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

const getStatusFromStatusLinkId = (
  statusLinkId: string | null,
  sprintStatusHistory: NotionStatusLink[]
): NotionStatusLink | null => {
  const statusLink = sprintStatusHistory.find(
    (statusLink) => statusLink.id === statusLinkId
  );
  return statusLink ?? null;
};

const roundToOneDecimal = (number: number): number => {
  return Math.round(number * 10) / 10;
};

export const getDataForSprintChart = (
  sprint: Sprint,
  sprintHistory: SprintHistoryWithStatusHistory[],
  notionStatusLinks: NotionStatusLink[]
) => {
  const capacityPerDay = getSprintCapacityPerDay(sprint);

  const sprintCapacity = capacityPerDay.reduce(
    (acc, { capacity }) => acc + capacity,
    0
  );

  const cumulativeCapacityPerDay = capacityPerDay.reduce(
    (acc, { day, capacity }, index) => {
      const newElement = {
        day,
        capacity: (index == 0 ? 0 : acc[index - 1].capacity) + capacity,
      };
      return [...acc, newElement];
    },
    [] as { day: Date; capacity: number }[]
  );

  const plotData: DataPlotType[] = cumulativeCapacityPerDay.map(
    ({ day, capacity: dailyCapacity }) => {
      const sprintHistoriesOnDay = sprintHistory.filter(
        (data) =>
          dayjs(data.timestamp).unix() >= dayjs(day).startOf('day').unix() &&
          dayjs(data.timestamp).unix() < dayjs(day).endOf('day').unix()
      );

      if (sprintHistoriesOnDay.length === 0) {
        return {
          time: dayjs(day).unix(),
          [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(
            sprintCapacity - dailyCapacity
          ),
        };
      }

      const latestSprintHistoryOnDay =
        sprintHistoriesOnDay[sprintHistoriesOnDay.length - 1];

      const { pointsInDone, pointsInToValidate } = getPointsInStatuses(
        latestSprintHistoryOnDay.sprintStatusHistory,
        notionStatusLinks
      );

      console.log(sprintCapacity - dailyCapacity);

      return {
        time: dayjs(day).endOf('day').unix(),
        [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(
          sprintCapacity - dailyCapacity
        ),
        [DataPlotLine.POINTS_LEFT]: roundToOneDecimal(
          sprintCapacity - pointsInDone
        ),
        [DataPlotLine.POINTS_DONE_INC_VALIDATE]: roundToOneDecimal(
          sprintCapacity - pointsInToValidate
        ),
      };
    }
  );

  const startOfSprint: DataPlotType = {
    time: dayjs(sprint.startDate).startOf('day').unix(),
    [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(sprintCapacity),
    [DataPlotLine.POINTS_LEFT]: roundToOneDecimal(sprintCapacity),
    [DataPlotLine.POINTS_DONE_INC_VALIDATE]: roundToOneDecimal(sprintCapacity),
  };

  return [startOfSprint, ...plotData];
};

const getPointsInStatuses = (
  sprintStatusHistory: SprintStatusHistory[],
  notionStatusLinks: NotionStatusLink[]
): { pointsInDone: number; pointsInToValidate: number } => {
  const pointsInDone = sprintStatusHistory.reduce((acc, statusHistory) => {
    if (
      getStatusFromStatusLinkId(
        statusHistory.notionStatusLinkId,
        notionStatusLinks
      )?.status === 'DONE'
    ) {
      return acc + statusHistory.pointsInStatus;
    }
    return acc;
  }, 0);

  const pointsInToValidate = sprintStatusHistory.reduce(
    (acc, statusHistory) => {
      if (
        getStatusFromStatusLinkId(
          statusHistory.notionStatusLinkId,
          notionStatusLinks
        )?.notionStatusName === 'TO VALIDATE'
      ) {
        return acc + statusHistory.pointsInStatus;
      }
      return acc;
    },
    0
  );

  return { pointsInDone, pointsInToValidate };
};
