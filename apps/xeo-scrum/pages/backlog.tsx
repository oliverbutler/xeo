import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { IconRenderer } from 'components/IconRenderer/IconRenderer';
import useSWR from 'swr';
import { GetBacklogRequest } from './api/backlog';

export function Backlog() {
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
    <div className="prose dark:prose-invert">
      <h2>Backlog</h2>

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
          {data.backlog.tickets.map((ticket) => (
            <tr key={ticket.notionId}>
              <td className="p-2">
                <span className="mr-2">
                  <IconRenderer icon={ticket.icon} />
                </span>
                {ticket.title}
              </td>
              <td className="p-2">{ticket.status}</td>
              <td className="p-2">{ticket.points}</td>
              <td className="p-2">{ticket.sprint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Backlog;
