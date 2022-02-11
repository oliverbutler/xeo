import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import { theme } from '../../../../../tailwind-workspace-preset';
import {
  DataPlotLine,
  DataPlotType,
  roundToOneDecimal,
} from 'utils/sprint/chart';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

interface Props {
  plotData: DataPlotType[];
  showPointsNotStarted?: boolean;
  smallGraph?: boolean;
}

export const SprintGraph: React.FunctionComponent<Props> = ({
  plotData,
  showPointsNotStarted,
  smallGraph,
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: { dataKey: DataPlotLine; value: number; color: string }[];
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
        <div className="bg-dark-100 dark:bg-dark-800 dark:border-l-dark-600 ml-4 border-l-4  bg-opacity-80 p-2 dark:bg-opacity-60">
          <p className="label">
            End of{' '}
            {dayjs(label * 1000)
              .startOf('day')
              .format('dddd')}
          </p>
          {deltaDoneExpected && pointsNotDone && (
            <p className="label" style={{ color: pointsNotDone.color }}>
              Done {roundToOneDecimal(deltaDoneExpected)}
            </p>
          )}
          {deltaDoneValidate && pointsValidateOrDone && (
            <p className="label" style={{ color: pointsValidateOrDone.color }}>
              Validate {roundToOneDecimal(deltaDoneValidate)}
            </p>
          )}
          {pointsExpectedNotDone && (
            <p className="label" style={{ color: pointsExpectedNotDone.color }}>
              Expected {pointsExpectedNotDone.value}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  const HEIGHT = smallGraph ? 200 : 400;
  const WIDTH = 1000;

  const nextTheme = useTheme();

  const isDark = nextTheme.theme === 'dark';

  return (
    <div
      className={classNames('relative -ml-6 mt-4', { 'text-sm': smallGraph })}
      style={{ height: HEIGHT }}
    >
      <ResponsiveContainer
        width={'99%'}
        height={HEIGHT}
        className="h-full w-full select-none"
      >
        <LineChart
          width={WIDTH}
          height={HEIGHT}
          data={plotData}
          style={{ position: 'absolute' }}
        >
          <CartesianGrid
            stroke={
              isDark
                ? theme.extend.colors.dark[700]
                : theme.extend.colors.dark[200]
            }
            strokeDasharray="5 5"
          />
          <XAxis
            dy={10}
            dataKey="time"
            name="Time"
            tickFormatter={(unixTime) =>
              dayjs(unixTime * 1000).format('ddd DD/MM')
            }
            type="category"
            stroke={
              isDark
                ? theme.extend.colors.dark[500]
                : theme.extend.colors.dark[800]
            }
          />

          <YAxis
            type="number"
            dataKey={DataPlotLine.EXPECTED_POINTS}
            stroke={
              isDark
                ? theme.extend.colors.dark[500]
                : theme.extend.colors.dark[800]
            }
          />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Tooltip content={CustomTooltip} />

          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={DataPlotLine.POINTS_LEFT}
            dataKey={DataPlotLine.POINTS_LEFT}
            type="monotone"
            dot={false}
            connectNulls
            strokeWidth={2}
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.primary[400]}
            name={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            dataKey={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            type="monotone"
            dot={false}
            strokeDasharray={'3 3'}
            strokeWidth={2}
            connectNulls
          />
          <Line
            stroke={theme.extend.colors.dark[400]}
            name={DataPlotLine.EXPECTED_POINTS}
            dataKey={DataPlotLine.EXPECTED_POINTS}
            type="monotone"
            strokeDasharray={'3 3'}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
