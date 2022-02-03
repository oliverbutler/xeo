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
} from 'recharts';
import { NotionStatusLink } from '@prisma/client';

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

  const plotData = data.sprintHistory.map((historyEvent) => {
    const statusObject = historyEvent.sprintStatusHistory.reduce(
      (acc, status) => {
        const key = status.notionStatusLinkId;
        acc[key] = status.pointsInStatus;
        return acc;
      },
      {} as { [key: string]: number }
    );

    return {
      name: historyEvent.timestamp,
      ...statusObject,
    };
  });

  console.log(plotData, data.notionBacklog.notionStatusLinks);

  return (
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.notionBacklog.notionStatusLinks.map((status) => (
          <Line
            key={status.status}
            dataKey={status.id}
            stroke="#8884d8"
            type="monotone"
            name={status.status}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
