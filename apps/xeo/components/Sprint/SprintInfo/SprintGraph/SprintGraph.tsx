import { CustomTooltip } from './SprintGraphTooltip';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import { theme } from '../../../../../../tailwind-workspace-preset';
import { DataPlotLine, DataPlotType } from 'utils/sprint/chart';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import utc from 'dayjs/plugin/utc';
import { Sprint } from '@prisma/client';
import { useViewport } from '@xeo/ui/hooks/useViewport';
import { getChartData } from './getChartData';

dayjs.extend(utc);

export interface SprintGraphProps {
  plotData: DataPlotType[] | undefined;
  showPointsNotStarted?: boolean;
  smallGraph?: boolean;
  sprint: Sprint | undefined;
}

export const SprintGraph: React.FunctionComponent<SprintGraphProps> = ({
  plotData,
  showPointsNotStarted,
  smallGraph,
  sprint,
}) => {
  const { width } = useViewport();

  const sm = theme.extend.screens.sm;
  const smWidth = Number(sm.substring(0, sm.length - 2));

  const isSmallWindow = width <= smWidth;

  const nextTheme = useTheme();

  const isDark = nextTheme.theme === 'dark';

  const { xAxisTicks, yAxisTicks } = getChartData(plotData, smallGraph, sprint);

  return (
    <div className="grow w-full mt-2 -ml-4">
      <ResponsiveContainer height="99%">
        <LineChart data={plotData ?? []}>
          <CartesianGrid
            stroke={
              isDark
                ? theme.extend.colors.dark[800]
                : theme.extend.colors.dark[200]
            }
            strokeDasharray="5 5"
          />
          <XAxis
            dy={10}
            dataKey="time"
            name="Time"
            tickFormatter={(time, index) =>
              smallGraph
                ? dayjs(time).format('ddd DD/MM')
                : index === 0
                ? 'Start'
                : index === (plotData ? plotData.length - 1 : -1)
                ? 'End'
                : dayjs(time).format('ddd DD/MM')
            }
            type="category"
            ticks={xAxisTicks}
            stroke={
              isDark
                ? theme.extend.colors.dark[500]
                : theme.extend.colors.dark[800]
            }
          />
          <YAxis
            type="number"
            dataKey={DataPlotLine.EXPECTED_POINTS}
            ticks={yAxisTicks}
            domain={['dataMin', 'dataMax']}
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
            stroke={theme.extend.colors.dark[400]}
            name={DataPlotLine.EXPECTED_POINTS}
            dataKey={DataPlotLine.EXPECTED_POINTS}
            type="linear"
            strokeDasharray={'3 3'}
            strokeWidth={2}
            connectNulls
            dot={false}
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.primary[400]}
            name={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            dataKey={DataPlotLine.POINTS_DONE_INC_VALIDATE}
            type="linear"
            strokeWidth={2}
            connectNulls
            dot={false}
          />
          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={DataPlotLine.POINTS_LEFT}
            dataKey={DataPlotLine.POINTS_LEFT}
            type="linear"
            connectNulls
            strokeWidth={2}
            dot={false}
          />
          {/* Pending Lines */}
          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={DataPlotLine.PENDING_POINTS_LEFT}
            dataKey={DataPlotLine.PENDING_POINTS_LEFT}
            strokeDasharray={'3 3'}
            type="linear"
            connectNulls
            strokeWidth={2}
            strokeOpacity={0.3}
            dot={false}
          />
          <Line
            stroke={theme.extend.colors.primary[400]}
            hide={!showPointsNotStarted}
            name={DataPlotLine.PENDING_POINTS_DONE_INC_VALIDATE}
            dataKey={DataPlotLine.PENDING_POINTS_DONE_INC_VALIDATE}
            strokeDasharray={'3 3'}
            type="linear"
            strokeWidth={2}
            strokeOpacity={0.3}
            connectNulls
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
