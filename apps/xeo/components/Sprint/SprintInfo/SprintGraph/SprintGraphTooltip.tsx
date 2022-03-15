import dayjs from 'dayjs';
import { DataPlotLine, roundToOneDecimal } from 'utils/sprint/chart';

export const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: {
    dataKey: DataPlotLine;
    value: number;
    color: string;
  }[];
  label: number;
}) => {
  if (active && payload && payload.length) {
    const pointsNotDone = payload.find(
      ({ dataKey }) => dataKey === DataPlotLine.POINTS_LEFT
    );
    const pointsValidateOrDone = payload.find(
      ({ dataKey }) => dataKey === DataPlotLine.POINTS_DONE_INC_VALIDATE
    );
    const pointsExpectedNotDone = payload.find(
      ({ dataKey }) => dataKey === DataPlotLine.EXPECTED_POINTS
    );
    const deltaDoneExpected =
      pointsNotDone && pointsExpectedNotDone
        ? pointsExpectedNotDone.value - pointsNotDone.value
        : undefined;
    const deltaDoneValidate =
      pointsValidateOrDone && pointsExpectedNotDone
        ? pointsExpectedNotDone.value - pointsValidateOrDone.value
        : undefined;
    return (
      <div className="bg-dark-100 dark:bg-dark-800 dark:border-l-dark-600 ml-4 border-l-4  bg-opacity-80 p-2 dark:bg-opacity-60 divide-y divide-gray-300">
        <div>
          <p className="label">{dayjs(label).format('dddd HH:mm')}</p>
          {deltaDoneExpected && pointsNotDone ? (
            <p
              className="label"
              style={{
                color: pointsNotDone.color,
              }}
            >
              {`Done: ${roundToOneDecimal(
                pointsNotDone.value
              )} (${roundToOneDecimal(deltaDoneExpected)})`}
            </p>
          ) : null}
          {deltaDoneValidate && pointsValidateOrDone ? (
            <p
              className="label"
              style={{
                color: pointsValidateOrDone.color,
              }}
            >
              {`Validate: ${roundToOneDecimal(
                pointsValidateOrDone.value
              )} (${roundToOneDecimal(deltaDoneValidate)})`}
            </p>
          ) : null}
        </div>
        <div>
          {pointsExpectedNotDone && (
            <p
              className="label"
              style={{
                color: pointsExpectedNotDone.color,
              }}
            >
              Expected: {pointsExpectedNotDone.value}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};
