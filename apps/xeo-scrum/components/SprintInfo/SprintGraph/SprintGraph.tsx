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
import { DataPlotLine, DataPlotType, getDaysArray } from 'utils/sprint/chart';
import { Sprint } from '@prisma/client';
import classNames from 'classnames';

interface Props {
  sprint: Sprint;
  plotData: DataPlotType[];
  view: SprintGraphView;
  showPointsNotStarted?: boolean;
  smallGraph?: boolean;
}

export enum SprintGraphView {
  SPRINT,
  TODAY,
}

export const SprintGraph: React.FunctionComponent<Props> = ({
  sprint,
  plotData,
  view,
  showPointsNotStarted,
  smallGraph,
}) => {
  const plotDataWithNow = [
    ...plotData,
    {
      ...plotData[plotData.length - 1],
      time: dayjs().unix(),
    },
  ];

  const filteredPlotData = view
    ? plotDataWithNow.filter((data) =>
        dayjs(data.time * 1000).isSame(dayjs(), 'day')
      )
    : plotDataWithNow;

  const todayXAxisTicks = [];

  for (let h = 3; h <= 21; h += 3) {
    todayXAxisTicks.push(dayjs().startOf('day').add(h, 'hour').unix());
  }

  const xAxisTicks = smallGraph
    ? [dayjs(sprint.startDate).unix(), dayjs(sprint.endDate).unix()]
    : view
    ? todayXAxisTicks
    : getDaysArray(
        sprint.startDate,
        dayjs(sprint.endDate).add(1, 'day').toDate()
      ).map((date) => {
        return dayjs(date).startOf('day').unix();
      });

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
          <p className="label">{dayjs(label * 1000).format('HH:mm')}</p>
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
          data={filteredPlotData}
          style={{ position: 'absolute' }}
        >
          <CartesianGrid stroke="#303030" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            name="Time"
            tickFormatter={(unixTime) => {
              return view
                ? dayjs(unixTime * 1000).format('HH:mm')
                : dayjs(unixTime * 1000).format('ddd DD/MM');
            }}
            domain={[xAxisTicks[0], xAxisTicks[xAxisTicks.length - 1]]}
            type="number"
            ticks={xAxisTicks}
          />

          <YAxis type="number" dataKey={DataPlotLine.SCOPE} />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Tooltip content={CustomTooltip} />
          {!smallGraph && <Legend />}
          <Line
            stroke={theme.extend.colors.dark[400]}
            name={DataPlotLine.SCOPE}
            type="step"
            dataKey={DataPlotLine.SCOPE}
            strokeDasharray="3 3"
            dot={false}
          />
          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={DataPlotLine.POINTS_LEFT}
            dataKey={DataPlotLine.POINTS_LEFT}
            type="monotone"
            dot={false}
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.primary[400]}
            name={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            dataKey={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            type="monotone"
            dot={false}
            strokeDasharray={'3 3'}
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.dark[400]}
            name={DataPlotLine.POINTS_NOT_STARTED}
            dataKey={DataPlotLine.POINTS_NOT_STARTED}
            type="monotone"
            strokeDasharray={'3 3'}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
