import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { DataPlotType, roundToOneDecimal } from 'utils/sprint/chart';
import { getSprintStats } from './getSprintStats';
import { SprintStat } from './SprintStat';

interface Props {
  sprintHistoryPlotData: DataPlotType[] | undefined;
  sprintId: string;
}

export const SprintStats: React.FunctionComponent<Props> = ({
  sprintHistoryPlotData,
}) => {
  const stats = sprintHistoryPlotData
    ? getSprintStats(sprintHistoryPlotData)
    : undefined;

  const { deltaPoints, pointsToValidate, percentDone, percentDoneValidated } =
    stats || {};

  return (
    <div className="grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-4 my-2">
      <SprintStat
        icon={
          <ChartBarIcon height={35} width={35} className="stroke-primary-300" />
        }
        title="Progress"
        value={
          percentDone && percentDoneValidated ? (
            <p>
              <span>{roundToOneDecimal(percentDone)}% D</span> -{' '}
              <span>{roundToOneDecimal(percentDoneValidated)}% V</span>
            </p>
          ) : (
            <p>
              <Skeleton width={100} />
            </p>
          )
        }
      />
      <SprintStat
        icon={
          deltaPoints ? (
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
          ) : (
            <QuestionMarkCircleIcon
              height={35}
              width={35}
              className="stroke-dark-300"
            />
          )
        }
        title="On Track"
        value={
          deltaPoints ? (
            <p
              className={classNames(
                { 'text-red-400 dark:text-red-300': deltaPoints < 0 },
                { 'text-green-400 dark:text-green-300': deltaPoints >= 0 }
              )}
            >
              {roundToOneDecimal(deltaPoints)}{' '}
              {roundToOneDecimal(deltaPoints) < 0 ? 'Behind' : 'Ahead'}
            </p>
          ) : (
            <p>
              <Skeleton width={100} />
            </p>
          )
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
        value={
          pointsToValidate ? (
            <p>Remaining: {roundToOneDecimal(pointsToValidate)}</p>
          ) : (
            <p>
              <Skeleton width={100} />
            </p>
          )
        }
      />
    </div>
  );
};
