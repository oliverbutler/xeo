import {
  BacklogStatus,
  NotionStatusLink,
  Sprint,
  SprintStatusHistory,
} from '@prisma/client';
import dayjs from 'dayjs';
import { SprintWithHistory } from 'pages/api/sprint';
import { isDeveloperWithCapacityArray } from './utils';

export enum DataPlotLine {
  CAPACITY = 'Capacity',
  POINTS_LEFT = 'Done',
  POINTS_DONE_INC_VALIDATE = 'To Validate',
  EXPECTED_POINTS = 'Expected',
}

export type DataPlotType = {
  time: string;
  sprintDay: number;
} & {
  [key in DataPlotLine]?: number;
};

export const getDaysArray = function (start: Date, end: Date): Date[] {
  const s = dayjs(start).startOf('day').toDate();
  const e = dayjs(end).endOf('day').toDate();
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

export const roundToOneDecimal = (number: number): number => {
  return Math.round(number * 10) / 10;
};

export const getCumulativeCapacityPerDay = (
  capacityPerDay: {
    day: Date;
    capacity: number;
  }[]
) =>
  capacityPerDay.reduce((acc, { day, capacity }, index) => {
    const newElement = {
      day,
      capacity: (index == 0 ? 0 : acc[index - 1].capacity) + capacity,
    };
    return [...acc, newElement];
  }, [] as { day: Date; capacity: number }[]);

export const getDataForSprintChart = (
  sprint: Sprint,
  sprintHistory: SprintWithHistory['sprintHistory'],
  notionStatusLinks: NotionStatusLink[]
) => {
  const capacityPerDay = getSprintCapacityPerDay(sprint);

  const sprintCapacity = capacityPerDay.reduce(
    (acc, { capacity }) => acc + capacity,
    0
  );

  const cumulativeCapacityPerDay = getCumulativeCapacityPerDay(capacityPerDay);

  const plotData: DataPlotType[] = cumulativeCapacityPerDay.map(
    ({ day, capacity: dailyCapacity }, dayIndex) => {
      const sprintHistoriesOnDay = sprintHistory.filter((data) => {
        const allowBefore = dayIndex === 0;
        const allowAfter = dayIndex === cumulativeCapacityPerDay.length - 1;

        return isDateOnSprintDay(
          data.timestamp,
          day,
          sprint,
          allowBefore,
          allowAfter
        );
      });

      const [hours, minutes] = sprint.dailyStartTime.split(':').map(Number);
      const timeOfDay = dayjs(day)
        .add(1, 'day')
        .set('hour', hours)
        .set('minute', minutes)
        .toISOString();

      const isLastDay = dayIndex === cumulativeCapacityPerDay.length - 1;

      const emptyDay = {
        time: isLastDay ? dayjs(sprint.endDate).toISOString() : timeOfDay,
        sprintDay: dayIndex,
        [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(
          sprintCapacity - dailyCapacity
        ),
      };

      if (sprintHistoriesOnDay.length === 0) {
        return emptyDay;
      }

      const latestSprintHistoryOnDay =
        sprintHistoriesOnDay[sprintHistoriesOnDay.length - 1];

      const { pointsInDone, pointsInToValidate } = getPointsInStatuses(
        latestSprintHistoryOnDay.sprintStatusHistory,
        notionStatusLinks
      );

      return {
        ...emptyDay,
        [DataPlotLine.POINTS_LEFT]: roundToOneDecimal(
          sprintCapacity - pointsInDone
        ),
        [DataPlotLine.POINTS_DONE_INC_VALIDATE]: roundToOneDecimal(
          sprintCapacity - pointsInDone - pointsInToValidate
        ),
      };
    }
  );

  const startOfSprint: DataPlotType = {
    time: dayjs(sprint.startDate).toISOString(),
    sprintDay: -1,
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
      )?.status === BacklogStatus.DONE
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
        )?.status === BacklogStatus.TO_VALIDATE
      ) {
        return acc + statusHistory.pointsInStatus;
      }
      return acc;
    },
    0
  );

  return { pointsInDone, pointsInToValidate };
};

export const isDateOnSprintDay = (
  dateToCheck: Date,
  targetDate: Date,
  sprint: Pick<Sprint, 'dailyStartTime'>,
  allowBefore = false,
  allowAfter = false
): boolean => {
  // Daily Start Time is HH:mm
  const [hours, minutes] = sprint.dailyStartTime.split(':').map(Number);

  const dailyStartTime = dayjs(targetDate)
    .set('hours', hours)
    .set('minutes', minutes);

  // If the date is friday, set the to the next monday @ start time
  const isTargetDateAFriday = dayjs(targetDate).day() === 5;

  const dailyEndTime = dayjs(targetDate)
    .add(isTargetDateAFriday ? 3 : 1, 'day')
    .set('hours', hours)
    .set('minutes', minutes);

  // If date is equal to start time of the day, otherwise it's always missed
  if (dateToCheck.getTime() === dailyStartTime.valueOf()) {
    return true;
  }

  const isAfterStart = allowBefore
    ? true
    : dayjs(dateToCheck).isAfter(dailyStartTime);

  const isBeforeEnd = allowAfter
    ? true
    : dayjs(dateToCheck).isBefore(dailyEndTime);

  return isAfterStart && isBeforeEnd;
};
