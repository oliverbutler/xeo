import { Button, ButtonVariation, Table } from '@xeo/ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { ProductBacklog, Ticket } from 'utils/notion/backlog';
import { SprintGraph } from './SprintGraph/SprintGraph';
import { SprintStats } from './SprintStats/SprintStats';

dayjs.extend(relativeTime);

interface Props {
  sprintData: GetSprintHistoryRequest['responseBody'];
  productBacklog: ProductBacklog;
}

export const SprintInfo: React.FunctionComponent<Props> = ({
  sprintData,
  productBacklog,
}) => {
  return (
    <div className="p-10 w-full">
      <div className="flex flex-row justify-between">
        <h1>Sprint - {sprintData.sprint.name}</h1>
        <div>
          <Button variation={ButtonVariation.Secondary}>Edit</Button>
        </div>
      </div>
      <SprintStats productBacklog={productBacklog} />
      <h2>Burn Down Chart</h2>
      <SprintGraph sprintData={sprintData} />
      <h2>Tickets</h2>
      <div>
        <Table<Ticket>
          data={productBacklog.tickets.sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt)
          )}
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
          ]}
        />
      </div>
    </div>
  );
};
