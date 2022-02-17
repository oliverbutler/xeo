import { CentredLoader, Alert } from '@xeo/ui';
import { fetcher } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';
import { SprintGraph } from 'components/SprintInfo/SprintGraph/SprintGraph';
import dayjs from 'dayjs';
import Link from 'next/link';
import { GetSprintsRequest } from 'pages/api/sprint';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { SprintWithPlotData } from 'utils/sprint/utils';
import { PreviousSprints } from './PreviousSprints/PreviousSprints';

export const Sprint: React.FunctionComponent = () => {
  const { data, error } = useSWR<GetSprintsRequest['responseBody']>(
    '/api/sprint',
    fetcher
  );

  if (!data && !error) {
    return (
      <div>
        <CentredLoader />
      </div>
    );
  }

  if (error || !data) {
    toast.error("Couldn't fetch sprints");
    return <div>Error Loading Sprints</div>;
  }

  const usersSprints = data.backlogs.reduce((acc, { sprints }) => {
    return [...acc, ...sprints];
  }, [] as SprintWithPlotData[]);

  const isSprintActive = (sprint: SprintWithPlotData) =>
    dayjs(sprint.sprint.endDate).isAfter(dayjs());

  const isSprintInactive = (sprint: SprintWithPlotData) =>
    !isSprintActive(sprint);

  const activeSprints = usersSprints.filter(isSprintActive);
  const completeSprints = usersSprints.filter(isSprintInactive);

  if (usersSprints.length === 0) {
    return (
      <Alert variation="info" className="mt-5">
        You currently have no Sprints, go to Connections to connect to a Backlog
        or contact your admin to give you access to your team.
      </Alert>
    );
  }

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeSprints.map(({ sprint, plotData }) => (
          <Link
            href="/sprint/[sprintId]"
            as={`/sprint/${sprint.id}`}
            key={sprint.id}
            passHref
          >
            <div className=" bg-dark-50 dark:bg-dark-800 flex cursor-pointer flex-row border-l-4 p-2 ">
              <div className="ml-1 w-fit flex-grow">
                <h3 className="mt-4">{sprint.name}</h3>
                <p>
                  {dayjs(sprint.startDate).format('DD/MM')} -{' '}
                  {dayjs(sprint.endDate).format('DD/MM')}
                </p>
              </div>
              <div className="h-52 w-72">
                <SprintGraph
                  sprint={sprint}
                  plotData={plotData}
                  showPointsNotStarted
                  smallGraph
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <h2>Past Sprints</h2>
      <PreviousSprints sprints={completeSprints} />
    </div>
  );
};
