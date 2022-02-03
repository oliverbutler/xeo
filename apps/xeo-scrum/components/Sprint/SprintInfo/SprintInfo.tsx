import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { GetBacklogSprintRequest } from 'pages/api/backlog/sprint';
import useSWR from 'swr';
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
import { ContentType } from 'recharts/types/component/Tooltip';

interface Props {
  sprintId: string;
}

export const SprintInfo: React.FunctionComponent<Props> = ({ sprintId }) => {
  const { data, error } = useSWR<GetBacklogSprintRequest['responseBody']>(
    `/api/backlog/sprint?sprintId=${sprintId}&setDefault=${true} `,
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error.message}</div>;
  }

  interface DataPlotType {
    time: number;
    scope: number;
    pointsLeft: number;
  }

  const plotData: DataPlotType[] = data.sprintHistory
    .map((historyEvent) => {
      const scope = historyEvent.sprintStatusHistory.reduce((acc, history) => {
        acc += history.pointsInStatus;
        return acc;
      }, 0);

      // Count points which are in BacklogStatus.DONE
      const pointsDone = historyEvent.sprintStatusHistory.reduce(
        (acc, history) => {
          const notionStatusLink = data.notionBacklog.notionStatusLinks.find(
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
        scope: scope,
        pointsLeft,
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
    data.sprint.startDate,
    data.sprint.endDate
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
      console.log(payload);
      return (
        <div className="bg-dark-800 bg-opacity-60 p-2 border-l-2 ml-4">
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

  return (
    <div className="mt-4">
      <ResponsiveContainer width={'99%'} height={400} className="w-full h-full">
        <LineChart
          width={500}
          height={400}
          data={plotData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#303030" strokeDasharray="5 5" />
          <XAxis
            dataKey="time"
            name="Time"
            tickFormatter={(unixTime) => {
              return dayjs(unixTime * 1000).format('dd DD/MM');
            }}
            domain={[
              dayjs(data.sprint.startDate).unix(),
              dayjs(data.sprint.endDate).unix(),
            ]}
            type="number"
            ticks={xAxisTicks}
          />

          <YAxis />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Tooltip content={CustomTooltip} />
          <Legend />
          <Line
            name="scope"
            type="monotone"
            dataKey="scope"
            strokeDasharray="3 3"
            stroke="#4b4b4b"
            dot={false}
          />
          <Line
            name="pointsLeft"
            type="monotone"
            dataKey="pointsLeft"
            stroke="#82ca9d"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
