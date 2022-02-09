import { CalculatorIcon } from '@heroicons/react/outline';
import { SprintStat } from 'components/SprintInfo/SprintStats/SprintStat';
import { getSprintCapacityPerDay } from 'utils/sprint/chart';
import { DEFAULT_SPRINT_CAPACITY } from '../SprintEdit/SprintEdit';
import { SprintCapacityDev } from './SprintCapacityTable';

interface Props {
  startDate: Date;
  endDate: Date;
  teamSpeed: number;
  devs: SprintCapacityDev[];
}

export const SprintCapacityCalculation: React.FunctionComponent<Props> = ({
  startDate,
  endDate,
  teamSpeed,
  devs,
}) => {
  const sprintDevelopersAndCapacity = devs.map((dev) => ({
    name: dev.name,
    capacity: dev.capacity.map((capacity) =>
      capacity === null || capacity === undefined
        ? DEFAULT_SPRINT_CAPACITY
        : capacity
    ),
  }));

  const capacityPerDay = getSprintCapacityPerDay({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    teamSpeed,
    sprintDevelopersAndCapacity,
  });

  const capacityPerDayAsString = capacityPerDay.reduce((acc, day, index) => {
    return `${acc}${day.capacity}${
      index === capacityPerDay.length - 1 ? '' : ', '
    }`;
  }, '');

  const totalCapacity =
    Math.round(
      capacityPerDay.reduce((acc, day) => acc + day.capacity, 0) * 10
    ) / 10;

  return (
    <div className="-ml-2 mb-4">
      <SprintStat
        icon={<CalculatorIcon width={25} height={25} />}
        title="Total Capacity"
        value={
          <p>
            {totalCapacity} <small>{`(${capacityPerDayAsString})`}</small>
          </p>
        }
      />
    </div>
  );
};
