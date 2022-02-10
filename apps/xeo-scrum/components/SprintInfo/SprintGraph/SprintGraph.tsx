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
import { DataPlotLine, DataPlotType } from 'utils/sprint/chart';
import classNames from 'classnames';

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
    payload: any[];
    label: number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border-l-dark-600 ml-4 border-l-4 bg-opacity-60 p-2">
          <p className="label">
            End of{' '}
            {dayjs(label * 1000)
              .startOf('day')
              .format('dddd')}
          </p>
          {payload.map((entry) => (
            <p
              key={entry.dataKey}
              className="label"
              style={{ color: entry.color }}
            >
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  const HEIGHT = smallGraph ? 200 : 400;
  const WIDTH = 1000;

  return (
    <div
      className={classNames('relative mt-4', { 'text-sm': smallGraph })}
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
          <CartesianGrid stroke="#303030" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            name="Time"
            tickFormatter={(unixTime) =>
              dayjs(unixTime * 1000).format('ddd DD/MM')
            }
            type="category"
          />

          <YAxis type="number" dataKey={DataPlotLine.EXPECTED_POINTS} />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Tooltip content={CustomTooltip} />
          {!smallGraph && <Legend />}

          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={DataPlotLine.POINTS_LEFT}
            dataKey={DataPlotLine.POINTS_LEFT}
            type="monotone"
            dot={false}
            connectNulls
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.primary[400]}
            name={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            dataKey={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            type="monotone"
            dot={false}
            strokeDasharray={'3 3'}
            connectNulls
          />
          <Line
            stroke={theme.extend.colors.dark[400]}
            name={DataPlotLine.EXPECTED_POINTS}
            dataKey={DataPlotLine.EXPECTED_POINTS}
            type="monotone"
            strokeDasharray={'3 3'}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
