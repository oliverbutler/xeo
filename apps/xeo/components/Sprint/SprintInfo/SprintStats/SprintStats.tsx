import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { Tooltip } from 'components/Tooltip/Tooltip';
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

  const {
    deltaPoints,
    pointsToValidate,
    totalPointsDone,
    totalPointsInSprint,
  } = stats || {};

  return (
    <div className="flex gap-2 sm:gap-4 flex-wrap">
      <Tooltip
        tooltip={`${
          totalPointsDone ? roundToOneDecimal(totalPointsDone) : ''
        } Points Done out of ${
          totalPointsInSprint ? roundToOneDecimal(totalPointsInSprint) : ''
        } (${
          totalPointsDone && totalPointsInSprint
            ? roundToOneDecimal((totalPointsDone / totalPointsInSprint) * 100)
            : ''
        }%)`}
      >
        <SprintStat
          icon={
            deltaPoints !== undefined ? (
              deltaPoints < 0 ? (
                <ExclamationCircleIcon
                  height={25}
                  width={25}
                  className="stroke-red-400 dark:stroke-red-300"
                />
              ) : (
                <CheckCircleIcon
                  height={25}
                  width={25}
                  className="stroke-primary-300"
                />
              )
            ) : (
              <QuestionMarkCircleIcon
                height={25}
                width={25}
                className="stroke-dark-300"
              />
            )
          }
          title="On Track"
          value={
            deltaPoints !== undefined ? (
              <p
                className={classNames(
                  'my-0',
                  { ' text-red-400 dark:text-red-300': deltaPoints < 0 },
                  { 'text-green-400 dark:text-green-300': deltaPoints >= 0 }
                )}
              >
                {roundToOneDecimal(deltaPoints)}{' '}
                {roundToOneDecimal(deltaPoints) < 0 ? 'Behind' : 'Ahead'}
              </p>
            ) : (
              <p className="my-0">
                <Skeleton width={50} />
              </p>
            )
          }
        />
      </Tooltip>
      <Tooltip tooltip={`${pointsToValidate} Points in "To Validate" column`}>
        <SprintStat
          icon={
            <ClipboardCheckIcon
              height={25}
              width={25}
              className="stroke-primary-300"
            />
          }
          title="Validation"
          value={
            pointsToValidate !== undefined ? (
              <p className="my-0">
                {roundToOneDecimal(pointsToValidate)} Validate
              </p>
            ) : (
              <p className="my-0">
                <Skeleton width={50} />
              </p>
            )
          }
        />
      </Tooltip>
    </div>
  );
};
