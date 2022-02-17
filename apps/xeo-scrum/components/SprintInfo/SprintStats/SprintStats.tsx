import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { DataPlotType, roundToOneDecimal } from 'utils/sprint/chart';
import { getSprintStats } from './getSprintStats';
import { SprintStat } from './SprintStat';

interface Props {
  sprintHistoryPlotData: DataPlotType[];
  sprintId: string;
}

export const SprintStats: React.FunctionComponent<Props> = ({
  sprintHistoryPlotData,
}) => {
  const stats = getSprintStats(sprintHistoryPlotData);

  if (!stats) {
    return null;
  }

  const { deltaPoints, pointsToValidate, percentDone, percentDoneValidated } =
    stats;

  return (
    <div className="grid grid-cols-3 2xl:grid-cols-6 gap-2 sm:gap-4 my-2">
      <SprintStat
        icon={
          <ChartBarIcon height={40} width={40} className="stroke-primary-300" />
        }
        title="Progress"
        value={
          <p>
            <span>{roundToOneDecimal(percentDone)}% D</span> -{' '}
            <span>{roundToOneDecimal(percentDoneValidated)}% V</span>
          </p>
        }
      />
      <SprintStat
        icon={
          deltaPoints < 0 ? (
            <ExclamationCircleIcon
              height={35}
              width={35}
              className="stroke-red-400 dark:stroke-red-300"
            />
          ) : (
            <CheckCircleIcon
              height={35}
              width={35}
              className="stroke-primary-300"
            />
          )
        }
        title="On Track"
        value={
          <p
            className={classNames(
              { 'text-red-400 dark:text-red-300': deltaPoints < 0 },
              { 'text-green-400 dark:text-green-300': deltaPoints >= 0 }
            )}
          >
            {roundToOneDecimal(deltaPoints)}{' '}
            {roundToOneDecimal(deltaPoints) < 0 ? 'Behind' : 'Ahead'}
          </p>
        }
      />
      <SprintStat
        icon={
          <ClipboardCheckIcon
            height={35}
            width={35}
            className="stroke-primary-300"
          />
        }
        title="Validation"
        value={<p>Remaining: {roundToOneDecimal(pointsToValidate)}</p>}
      />
    </div>
  );
};
