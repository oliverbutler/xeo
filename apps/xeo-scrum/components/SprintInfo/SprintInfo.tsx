import { BeakerIcon, SearchIcon } from '@heroicons/react/outline';
import { Button, ButtonVariation, Clickable, Table } from '@xeo/ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { useState } from 'react';
import { ProductBacklog, Ticket } from 'utils/notion/backlog';
import { SprintGraph, SprintGraphView } from './SprintGraph/SprintGraph';
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
  const [graphView, setGraphView] = useState<SprintGraphView>(
    SprintGraphView.SPRINT
  );
  const [showPointsNotStarted, setShowPointsNotStarted] = useState(true);

  return (
    <div className="p-10 w-full">
      <div className="flex flex-row justify-between">
        <h1>Sprint - {sprintData.sprint.name}</h1>
        <div>
          <Button variation={ButtonVariation.Secondary}>Edit</Button>
        </div>
      </div>
      <SprintStats productBacklog={productBacklog} />
      <div className="flex flex-row justify-between items-end">
        <h2>Burn Down Chart</h2>
        <div className="flex flex-row gap-2">
          <Clickable
            showActiveLabel={showPointsNotStarted}
            onClick={() => setShowPointsNotStarted(!showPointsNotStarted)}
          >
            <BeakerIcon height={20} width={20} />
          </Clickable>
          <Clickable
            showActiveLabel={graphView === SprintGraphView.TODAY}
            onClick={() =>
              setGraphView(
                graphView === SprintGraphView.TODAY
                  ? SprintGraphView.SPRINT
                  : SprintGraphView.TODAY
              )
            }
          >
            <SearchIcon height={20} width={20} />
          </Clickable>
        </div>
      </div>

      <SprintGraph
        sprintData={sprintData}
        view={graphView}
        showPointsNotStarted={showPointsNotStarted}
      />
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
