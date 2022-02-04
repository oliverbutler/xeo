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
  view: SprintGraphView;
  showPointsNotStarted?: boolean;
}

export enum SprintGraphView {
  SPRINT,
  TODAY,
}

const POINTS_LEFT = 'Points Not Done';
const POINTS_NOT_STARTED = 'Points Not Started';
const SCOPE = 'Scope';

export const SprintGraph: React.FunctionComponent<Props> = ({
  sprintData,
  view,
  showPointsNotStarted,
}) => {
  interface DataPlotType {
    time: number;
    [SCOPE]: number;
    [POINTS_LEFT]: number;
    [POINTS_NOT_STARTED]: number;
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

      const pointsDoneIncludingDoing = historyEvent.sprintStatusHistory.reduce(
        (acc, history) => {
          const notionStatusLink = sprintData.notionStatusLinks.find(
            (status) => status.id === history.notionStatusLinkId
          );

          if (
            notionStatusLink?.status === 'DONE' ||
            notionStatusLink?.status === 'IN_PROGRESS'
          ) {
            acc += history.pointsInStatus;
          }

          return acc;
        },
        0
      );

      const pointsLeft = scope - pointsDone;
      const pointsLeftExDoing = scope - pointsDoneIncludingDoing;

      return {
        time: dayjs(historyEvent.timestamp).unix(),
        [SCOPE]: scope,
        [POINTS_LEFT]: pointsLeft,
        [POINTS_NOT_STARTED]: pointsLeftExDoing,
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

  const xAxisTicks = view
    ? todayXAxisTicks
    : getDaysArray(sprintData.sprint.startDate, sprintData.sprint.endDate).map(
        (date) => {
          return dayjs(date).startOf('day').unix();
        }
      );

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

  const HEIGHT = 400;
  const WIDTH = 1000;

  return (
    <div className="mt-4 relative" style={{ height: HEIGHT }}>
      <ResponsiveContainer
        width={'99%'}
        height={HEIGHT}
        className="w-full h-full select-none"
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
            dot={false}
          />
          <Line
            stroke={theme.extend.colors.secondary[400]}
            name={POINTS_LEFT}
            dataKey={POINTS_LEFT}
            type="monotone"
            dot={false}
          />
          <Line
            hide={!showPointsNotStarted}
            stroke={theme.extend.colors.primary[400]}
            name={POINTS_NOT_STARTED}
            dataKey={POINTS_NOT_STARTED}
            type="monotone"
            strokeDasharray={'3 3'}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
