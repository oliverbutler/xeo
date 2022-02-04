import { Table } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { SprintRenderer } from 'components/SprintRenderer/SprintRenderer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR from 'swr';
import { Ticket } from 'utils/notion/backlog';
import { GetBacklogRequest } from './api/backlog';

dayjs.extend(relativeTime);

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

  const tickets = data?.backlog.tickets ?? [];

  return (
    <div className="p-10">
      <h1>Backlog - {data?.notionBacklog.databaseName}</h1>

      <Table<Ticket>
        data={tickets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))}
        columns={[
          {
            Header: 'Title',
            accessor: 'title',
            Cell: (cell) => (
              <span>
                <a
                  href={cell.row.original.notionUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {cell.value}
                </a>
              </span>
            ),
          },
          {
            Header: 'Status',
            accessor: (ticket) => ticket?.notionStatusLink?.notionStatusName,
          },
          {
            Header: 'Points',
            accessor: 'points',
          },
          {
            Header: 'Updated',
            accessor: (ticket) => dayjs(ticket?.updatedAt).fromNow(),
          },
          {
            Header: 'Sprint',
            accessor: 'sprint',
            Cell: (cell) => (
              <SprintRenderer
                sprint={cell.value}
                notionSprintSelect={cell.row.original.notionSprintSelect}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

export default Index;
