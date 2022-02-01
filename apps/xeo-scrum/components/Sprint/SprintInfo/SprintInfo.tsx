import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { GetBacklogSprintRequest } from 'pages/api/backlog/sprint';
import useSWR from 'swr';

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

  return (
    <div>
      {data.backlog.tickets.map((ticket) => (
        <div key={ticket.notionId}>
          {ticket.title} {ticket.status} {ticket.points}
        </div>
      ))}
    </div>
  );
};
