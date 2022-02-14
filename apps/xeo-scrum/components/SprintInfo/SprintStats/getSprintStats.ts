import {
  DataPlotLine,
  DataPlotType,
  roundToOneDecimal,
} from 'utils/sprint/chart';

export const getSprintStats = (sprintHistoryPlotData: DataPlotType[]) => {
  const sprintHistoryWithPoints = sprintHistoryPlotData.filter(
    (x) => x[DataPlotLine.POINTS_LEFT] !== undefined
  );

  const latestSprintHistoryWithPoints =
    sprintHistoryWithPoints[sprintHistoryWithPoints.length - 1];

  if (!latestSprintHistoryWithPoints) {
    return undefined;
  }

  const firstHistoryPoint = sprintHistoryPlotData[0];

  const totalPointsInSprint = firstHistoryPoint[DataPlotLine.EXPECTED_POINTS];

  const pointsLeft = latestSprintHistoryWithPoints[DataPlotLine.POINTS_LEFT];

  const pointsLeftValidated =
    latestSprintHistoryWithPoints[DataPlotLine.POINTS_DONE_INC_VALIDATE];

  const pointsToValidate =
    pointsLeft !== undefined && pointsLeftValidated
      ? pointsLeft - pointsLeftValidated
      : 0;

  const pointsExpectedInLatestSprint =
    latestSprintHistoryWithPoints[DataPlotLine.EXPECTED_POINTS];

  const deltaPoints =
    pointsExpectedInLatestSprint !== undefined && pointsLeft !== undefined
      ? roundToOneDecimal(pointsExpectedInLatestSprint - pointsLeft)
      : 0;

  const percentDone =
    pointsLeft !== undefined && totalPointsInSprint !== undefined
      ? Math.round(
          ((totalPointsInSprint - pointsLeft) / totalPointsInSprint) * 100
        )
      : 0;

  const percentDoneValidated =
    pointsLeftValidated !== undefined && totalPointsInSprint !== undefined
      ? Math.round(
          ((totalPointsInSprint - pointsLeftValidated) / totalPointsInSprint) *
            100
        )
      : 0;

  return { deltaPoints, pointsToValidate, percentDone, percentDoneValidated };
};
