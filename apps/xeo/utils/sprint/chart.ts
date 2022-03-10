import {
  BacklogStatus,
  NotionStatusLink,
  Sprint,
  SprintStatusHistory,
} from '@prisma/client';
import dayjs from 'dayjs';
import { SprintWithHistory } from 'pages/api/team/[teamId]/sprint';
import { isDeveloperWithCapacityArray } from './utils';

export enum DataPlotLine {
  CAPACITY = 'Capacity',
  POINTS_LEFT = 'Done',
  PENDING_POINTS_LEFT = 'Pending',
  POINTS_DONE_INC_VALIDATE = 'To Validate',
  PENDING_POINTS_DONE_INC_VALIDATE = 'Pending To Validate',
  EXPECTED_POINTS = 'Expected',
}

export type DataPlotType = {
  time: string;
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

// TODO Cleanup this function.
//
// - getSprintDaysArrayWithSprintHistory works perfectly, but the length of this is not equal to the length of the capacityPerDay array.
// - There is some weirdness with fridays and mondays, I've patched it but it's not clean
// -
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

  const sprintDaysWithHistory = getSprintDaysArrayWithSprintHistory(
    getSprintDaysArray(sprint),
    sprintHistory
  );

  const [hours, minutes] = sprint.dailyStartTime.split(':').map(Number);

  const plotData: DataPlotType[] = sprintDaysWithHistory.map(
    ({ date, sprintHistories }, dayIndex) => {
      // if date is monday, at dailyStartTime, keep the same expected capacity as the start time
      const numberOfDaysToSubtract =
        date.getDay() === 1 &&
        date.getHours() === hours &&
        date.getMinutes() === minutes
          ? 3
          : 1;

      const isLastDay = dayIndex === sprintDaysWithHistory.length - 1;

      const defaultExpectedCapacity = dayIndex === 0 ? 0 : sprintCapacity;

      const expectedDailyCapacity =
        cumulativeCapacityPerDay.find((cumDate) =>
          dayjs(cumDate.day).isSame(
            dayjs(date).subtract(numberOfDaysToSubtract, 'day'),
            'day'
          )
        )?.capacity ?? defaultExpectedCapacity;

      if (sprintHistories.length === 0) {
        // if no history on the first day, return full capacity
        if (dayIndex === 0) {
          return {
            time: dayjs(date).toISOString(),
            [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(sprintCapacity),
            [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(sprintCapacity),
            [DataPlotLine.POINTS_LEFT]: roundToOneDecimal(sprintCapacity),
            [DataPlotLine.POINTS_DONE_INC_VALIDATE]:
              roundToOneDecimal(sprintCapacity),
          };
        }

        return {
          time: dayjs(date).toISOString(),
          [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(
            isLastDay ? 0 : sprintCapacity - expectedDailyCapacity
          ),
        };
      }

      const latestSprintHistoryOnDay =
        sprintHistories[sprintHistories.length - 1];

      const { pointsInDone, pointsInToValidate } = getPointsInStatuses(
        latestSprintHistoryOnDay.sprintStatusHistory,
        notionStatusLinks
      );

      return {
        time: dayjs(date).toISOString(),
        [DataPlotLine.EXPECTED_POINTS]: roundToOneDecimal(
          sprintCapacity - expectedDailyCapacity
        ),
        [DataPlotLine.POINTS_LEFT]: roundToOneDecimal(
          sprintCapacity - pointsInDone
        ),
        [DataPlotLine.POINTS_DONE_INC_VALIDATE]: roundToOneDecimal(
          sprintCapacity - pointsInDone - pointsInToValidate
        ),
      };
    }
  );

  // Add a secondary line which is lower opacity, to reflect future capacity
  const plotDataWithPendingData: DataPlotType[] | undefined = plotData?.map(
    (data) => {
      const isPointTomorrow = dayjs(data.time).isAfter(dayjs(), 'day');

      if (isPointTomorrow) {
        return {
          time: data.time,
          [DataPlotLine.EXPECTED_POINTS]: data[DataPlotLine.EXPECTED_POINTS],
          [DataPlotLine.PENDING_POINTS_LEFT]: data[DataPlotLine.POINTS_LEFT],
          [DataPlotLine.PENDING_POINTS_DONE_INC_VALIDATE]:
            data[DataPlotLine.POINTS_DONE_INC_VALIDATE],
        };
      }

      return {
        ...data,
        ...(data[DataPlotLine.POINTS_LEFT]
          ? {
              [DataPlotLine.PENDING_POINTS_LEFT]:
                data[DataPlotLine.POINTS_LEFT],
            }
          : undefined),
        ...(data[DataPlotLine.POINTS_DONE_INC_VALIDATE]
          ? {
              [DataPlotLine.PENDING_POINTS_DONE_INC_VALIDATE]:
                data[DataPlotLine.POINTS_DONE_INC_VALIDATE],
            }
          : undefined),
      };
    }
  );

  return plotDataWithPendingData;
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

/**
 * Get the xAxis ticks for the sprint chart
 */
export const getSprintDaysArray = (
  sprint: Pick<Sprint, 'startDate' | 'endDate' | 'dailyStartTime'>
) => {
  const [hours, minutes] = sprint.dailyStartTime.split(':').map(Number);

  const businessDays = getBusinessDaysArray(sprint.startDate, sprint.endDate);

  const days = businessDays
    .map((sprintDay, dayIndex) => {
      const startTimeOnDay = dayjs(sprintDay)
        .set('hours', hours)
        .set('minutes', minutes);

      if (dayIndex === 0) {
        return sprint.startDate;
      }

      if (dayIndex === businessDays.length - 1) {
        if (dayjs(sprint.endDate).isAfter(startTimeOnDay)) {
          return [startTimeOnDay.toDate(), sprint.endDate];
        } else {
          return sprint.endDate;
        }
      }

      return startTimeOnDay.toDate();
    })
    .flat();

  return days;
};

/**
 * Assign the sprint history to an array of days
 */
export const getSprintDaysArrayWithSprintHistory = (
  days: Date[],
  sprintHistory: SprintWithHistory['sprintHistory']
) => {
  const sprintDaysWithHistory = [];

  for (let i = 0; i < days.length; i++) {
    const currentDay = days[i];
    const previousDay = days[i - 1];

    if (i === 0) {
      sprintDaysWithHistory.push({
        date: currentDay,
        sprintHistories: sprintHistory.filter(
          (history) => history.timestamp.getTime() < currentDay.getTime()
        ),
      });
      continue;
    }

    sprintDaysWithHistory.push({
      date: currentDay,
      sprintHistories: sprintHistory.filter(
        (history) =>
          history.timestamp.getTime() >= previousDay.getTime() &&
          history.timestamp.getTime() < currentDay.getTime()
      ),
    });
  }

  return sprintDaysWithHistory;
};
