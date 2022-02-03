import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { IconRenderer } from 'components/IconRenderer/IconRenderer';
import { SprintRenderer } from 'components/SprintRenderer/SprintRenderer';
import useSWR from 'swr';
import { GetBacklogRequest } from './api/backlog';

export function Index() {
  const { data, error } = useSWR<GetBacklogRequest['responseBody']>(
    '/api/backlog',
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-10">
      <h1>Backlog - {data?.notionBacklog.databaseName}</h1>

      <table className="divide-y divide-gray-400">
        <thead className="bg-dark-800">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Status</th>
            <th className="p-2">Points</th>
            <th className="p-2">Sprint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400">
          {data?.backlog?.tickets.map((ticket) => (
            <tr key={ticket.notionId}>
              <td className="p-2">
                <span className="mr-2">
                  <IconRenderer icon={ticket.icon} />
                </span>
                {ticket.title}
              </td>
              <td
                className="p-2"
                style={{ color: ticket.notionSprintSelect?.color }}
              >
                {ticket.notionStatusLink?.notionStatusName}
              </td>
              <td className="p-2">{ticket.points}</td>
              <td className="p-2">
                <SprintRenderer
                  sprint={ticket.sprint}
                  notionSprintSelect={ticket.notionSprintSelect}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Index;
