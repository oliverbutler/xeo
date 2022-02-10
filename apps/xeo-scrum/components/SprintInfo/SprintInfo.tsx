import { BeakerIcon, RefreshIcon } from '@heroicons/react/outline';
import { Button, ButtonVariation, CentredLoader, Clickable } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { GetSprintHistoryRequest } from 'pages/api/sprint/[sprintId]/history';
import { useCallback, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { SprintGraph } from './SprintGraph/SprintGraph';
import { SprintStats } from './SprintStats/SprintStats';
import axios from 'axios';
import { PostUpdateSprintHistory } from 'pages/api/sprint/[sprintId]/update-history';
import { ScopedMutator } from 'swr/dist/types';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

interface Props {
  sprintId: string;
}

const updateSprintHistory = async (
  sprintId: string,
  mutate: ScopedMutator<unknown>
) => {
  const body: PostUpdateSprintHistory['request'] = { sprintId };

  try {
    const { data } = await axios.post<PostUpdateSprintHistory['response']>(
      `/api/sprint/${sprintId}/update-history`,
      body
    );

    if (data.updatedSprintPlotData) {
      mutate(`/api/sprint/${sprintId}/history`); // Tell SWR to update the data
    }
  } catch (error) {
    toast.error('Error fetching latest Sprint history, please try again later');
  }
};

export const SprintInfo: React.FunctionComponent<Props> = ({ sprintId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR<GetSprintHistoryRequest['responseBody']>(
    `/api/sprint/${sprintId}/history`,
    fetcher
  );
  const { mutate } = useSWRConfig();

  const handleUpdateSprintHistory = useCallback(async () => {
    if (data?.sprint) {
      if (!dayjs(data.sprint.endDate).isBefore(dayjs(), 'minute')) {
        setIsLoading(true);
        await updateSprintHistory(sprintId, mutate);
        setIsLoading(false);
      }
    }
  }, [data, mutate, sprintId]);

  useEffect(() => {
    handleUpdateSprintHistory();
  }, [handleUpdateSprintHistory]);

  const [showPointsNotStarted, setShowPointsNotStarted] = useState(true);

  if (!data || error) {
    return (
      <div>
        <CentredLoader />
      </div>
    );
  }

  if (error || !data.sprint) {
    return <div>Error fetching Sprint</div>;
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
            showActiveLabel={isLoading}
            onClick={isLoading ? undefined : handleUpdateSprintHistory}
          >
            <RefreshIcon
              height={20}
              width={20}
              className={isLoading ? 'animate-reverse-spin' : ''}
            />
          </Clickable>
          <Clickable
            showActiveLabel={showPointsNotStarted}
            onClick={() => setShowPointsNotStarted(!showPointsNotStarted)}
          >
            <BeakerIcon height={20} width={20} />
          </Clickable>
        </div>
      </div>

      <SprintGraph
        plotData={sprintHistoryPlotData}
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
