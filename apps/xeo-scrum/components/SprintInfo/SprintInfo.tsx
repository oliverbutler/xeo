import { BeakerIcon, SearchIcon } from '@heroicons/react/outline';
import { Button, ButtonVariation, Clickable } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { GetSprintHistoryRequest } from 'pages/api/sprint/[sprintId]/history';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SprintGraph, SprintGraphView } from './SprintGraph/SprintGraph';
import { SprintStats } from './SprintStats/SprintStats';
import axios from 'axios';
import { PostUpdateSprintHistory } from 'pages/api/sprint/[sprintId]/update-history';

dayjs.extend(relativeTime);

interface Props {
  sprintId: string;
}

const updateSprintHistory = async (sprintId: string) => {
  const body: PostUpdateSprintHistory['request'] = { sprintId };
  const { data } = await axios.post<PostUpdateSprintHistory['response']>(
    `/api/sprint/${sprintId}/update-history`,
    body
  );

  if (data.updatedSprintPlotData) {
    console.info('[Notion API] Updated sprint plot data');
  }
};

export const SprintInfo: React.FunctionComponent<Props> = ({ sprintId }) => {
  const { data, error } = useSWR<GetSprintHistoryRequest['responseBody']>(
    `/api/sprint/${sprintId}/history`,
    fetcher
  );

  useEffect(() => {
    if (data?.sprint) {
      if (dayjs(data.sprint.endDate).isBefore(dayjs(), 'minute')) {
        console.log('Sprint ended, not updating');
      } else {
        updateSprintHistory(sprintId);
      }
    }
  }, [data?.sprint, sprintId]);

  const [graphView, setGraphView] = useState<SprintGraphView>(
    SprintGraphView.SPRINT
  );
  const [showPointsNotStarted, setShowPointsNotStarted] = useState(true);

  if (!data || error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { sprint, sprintHistoryPlotData } = data;

  return (
    <div className="w-full p-10">
      <div className="flex flex-row justify-between">
        <h1>{sprint.name}</h1>
        <div>
          <Link href={`/sprint/${sprint.id}/edit`} passHref>
            <Button variation={ButtonVariation.Secondary}>Edit</Button>
          </Link>
        </div>
      </div>
      <SprintStats
        sprintHistoryPlotData={sprintHistoryPlotData}
        sprintId={sprintId}
      />
      <div className="flex flex-row items-end justify-between">
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
        sprint={sprint}
        plotData={sprintHistoryPlotData}
        view={graphView}
        showPointsNotStarted={showPointsNotStarted}
      />
      {/* <h2>Tickets</h2>
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
      </div> */}
    </div>
  );
};
