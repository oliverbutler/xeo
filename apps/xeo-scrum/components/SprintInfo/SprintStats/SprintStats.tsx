import {
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import {
  DataPlotLine,
  DataPlotType,
  roundToOneDecimal,
} from 'utils/sprint/chart';
import { SprintStat } from './SprintStat';

interface Props {
  sprintHistoryPlotData: DataPlotType[];
  sprintId: string;
}

export const SprintStats: React.FunctionComponent<Props> = ({
  sprintHistoryPlotData,
}) => {
  const sprintHistoryWithPoints = sprintHistoryPlotData.filter(
    (x) => x[DataPlotLine.POINTS_LEFT] !== undefined
  );

  const latestSprintHistoryWithPoints =
    sprintHistoryWithPoints[sprintHistoryWithPoints.length - 1];

  if (!latestSprintHistoryWithPoints) {
    return null;
  }

  const firstHistoryPoint = sprintHistoryPlotData[0];

  const totalPointsInSprint = firstHistoryPoint[DataPlotLine.EXPECTED_POINTS];

  const pointsLeft = latestSprintHistoryWithPoints[DataPlotLine.POINTS_LEFT];

  const pointsLeftValidated =
    latestSprintHistoryWithPoints[DataPlotLine.POINTS_DONE_INC_VALIDATE];

  const pointsToValidate =
    pointsLeft && pointsLeftValidated ? pointsLeft - pointsLeftValidated : 0;

  const pointsExpectedInLatestSprint =
    latestSprintHistoryWithPoints[DataPlotLine.EXPECTED_POINTS];

  const deltaPoints =
    pointsExpectedInLatestSprint && pointsLeft
      ? roundToOneDecimal(pointsExpectedInLatestSprint - pointsLeft)
      : 0;

  const deltaPointsWithValidation =
    pointsExpectedInLatestSprint && pointsLeftValidated
      ? roundToOneDecimal(pointsExpectedInLatestSprint - pointsLeftValidated)
      : 0;

  const percentDone =
    pointsLeft && totalPointsInSprint
      ? Math.round(
          ((totalPointsInSprint - pointsLeft) / totalPointsInSprint) * 100
        )
      : 0;

  const percentDoneValidated =
    pointsLeftValidated && totalPointsInSprint
      ? Math.round(
          ((totalPointsInSprint - pointsLeftValidated) / totalPointsInSprint) *
            100
        )
      : 0;

  return (
    <div className="flex flex-row flex-wrap">
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
              height={40}
              width={40}
              className="stroke-red-300"
            />
          ) : (
            <CheckCircleIcon
              height={40}
              width={40}
              className="stroke-primary-300"
            />
          )
        }
        title="On Track"
        value={
          <p
            className={classNames(
              { 'text-red-300': deltaPoints < 0 },
              { 'text-green-300': deltaPoints >= 0 }
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
            height={40}
            width={40}
            className="stroke-primary-300"
          />
        }
        title="Validation"
        value={<p>Remaining: {roundToOneDecimal(pointsToValidate)}</p>}
      />
    </div>
  );
};
