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
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { theme } from '../../../../../tailwind-workspace-preset';

interface Props {
  sprintData: GetSprintHistoryRequest['responseBody'];
}

const POINTS_LEFT = 'Points Left';
const SCOPE = 'Scope';

export const SprintGraph: React.FunctionComponent<Props> = ({ sprintData }) => {
  interface DataPlotType {
    time: number;
    [SCOPE]: number;
    [POINTS_LEFT]: number;
  }

  const plotData: DataPlotType[] = sprintData.sprintHistory
    .map((historyEvent) => {
      const scope = historyEvent.sprintStatusHistory.reduce((acc, history) => {
        acc += history.pointsInStatus;
        return acc;
      }, 0);

      // Count points which are in BacklogStatus.DONE
      const pointsDone = historyEvent.sprintStatusHistory.reduce(
        (acc, history) => {
          const notionStatusLink = sprintData.notionStatusLinks.find(
            (status) => status.id === history.notionStatusLinkId
          );

          if (notionStatusLink?.status === 'DONE') {
            acc += history.pointsInStatus;
          }

          return acc;
        },
        0
      );

      const pointsLeft = scope - pointsDone;

      return {
        time: dayjs(historyEvent.timestamp).unix(),
        [SCOPE]: scope,
        [POINTS_LEFT]: pointsLeft,
      };
    })
    .sort((a, b) => a.time - b.time);

  const getDaysArray = function (start: Date, end: Date) {
    const s = new Date(start);
    const e = new Date(end);
    const a: Date[] = [];
    for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      a.push(new Date(d));
    }
    return a;
  };

  const xAxisTicks = getDaysArray(
    sprintData.sprint.startDate,
    sprintData.sprint.endDate
  ).map((date) => dayjs(date).unix());

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
        <div className="bg-dark-800 bg-opacity-60 p-2 border-l-dark-600 border-l-4 ml-4">
          <p className="label">{dayjs(label * 1000).format('HH:MM')}</p>
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

  const HEIGHT = 500;
  const WIDTH = 1000;

  return (
    <div className="mt-4 relative" style={{ height: HEIGHT }}>
      <ResponsiveContainer
        width={'99%'}
        height={HEIGHT}
        className="w-full h-full"
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
            tickFormatter={(unixTime) => {
              return dayjs(unixTime * 1000).format('dd DD/MM');
            }}
            domain={[
              dayjs(sprintData.sprint.startDate).unix(),
              dayjs(sprintData.sprint.endDate).unix(),
            ]}
            type="number"
            ticks={xAxisTicks}
          />

          <YAxis type="number" dataKey={POINTS_LEFT} />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Tooltip content={CustomTooltip} />
          <Legend />
          <Line
            stroke={theme.extend.colors.dark[400]}
            name={SCOPE}
            type="step"
            dataKey={SCOPE}
            strokeDasharray="3 3"
            connectNulls
            dot={false}
          />
          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={POINTS_LEFT}
            dataKey={POINTS_LEFT}
            type="monotone"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
