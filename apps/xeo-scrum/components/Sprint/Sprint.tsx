import { InformationCircleIcon } from '@heroicons/react/outline';
import { Sprint as PrismaSprint } from '@prisma/client';
import { CentredLoader } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { SprintGraph } from 'components/SprintInfo/SprintGraph/SprintGraph';
import dayjs from 'dayjs';
import Link from 'next/link';
import { GetSprintsRequest } from 'pages/api/sprint';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import {
  isActiveSprintWithPlotData,
  isCompleteSprintWithoutPlotData,
  SprintWithPlotData,
} from 'utils/sprint/utils';

interface SprintStatusBadgeProps {
  sprint: PrismaSprint;
}

export const SprintStatusBadge: React.FunctionComponent<
  SprintStatusBadgeProps
> = ({ sprint }) => {
  if (dayjs(sprint.endDate).isBefore(dayjs(), 'minute')) {
    return (
      <div className="text-dark-900 w-24 rounded-md bg-red-200 text-center">
        Past
      </div>
    );
  }

  return (
    <div className="text-dark-900 w-24 rounded-md bg-green-200 text-center">
      Active
    </div>
  );
};

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

  const activeSprints = usersSprints.filter(isActiveSprintWithPlotData);
  const completeSprints = usersSprints.filter(isCompleteSprintWithoutPlotData);

  if (usersSprints.length === 0) {
    return (
      <div className="bg-primary-200 text-primary-800 mb-10 mt-5 flex flex-row items-center rounded-lg p-5">
        <InformationCircleIcon width={40} height={40} className="mr-3" />
        You currently have no Sprints, go to Connections to connect to a Backlog
        or contact your admin to give you access to your team.
      </div>
    );
  }

  return (
    <div className="py-5">
      <h2>Active Sprints</h2>

      <div className="flex flex-row flex-wrap gap-4">
        {activeSprints.map(({ sprint, plotData }) => (
          <Link
            href="/sprint/[sprintId]"
            as={`/sprint/${sprint.id}`}
            key={sprint.id}
            passHref
          >
            <div className="border-dark-400 bg-dark-800 flex cursor-pointer flex-row border-l-4 p-2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
              <div className="ml-1 w-fit flex-grow">
                <h3 className="mt-4">{sprint.name}</h3>
                <p>
                  {dayjs(sprint.startDate).format('DD/MM')} -{' '}
                  {dayjs(sprint.endDate).format('DD/MM')}
                </p>
              </div>
              <div className="-ml-6 h-52 w-72">
                <SprintGraph plotData={plotData} smallGraph />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <h2>Past Sprints</h2>
      <div className="flex flex-row flex-wrap gap-4">
        {completeSprints.map(({ sprint }) => (
          <Link
            href="/sprint/[sprintId]"
            as={`/sprint/${sprint.id}`}
            key={sprint.id}
            passHref
          >
            <div className="border-dark-400 bg-dark-800 flex w-1/3 cursor-pointer flex-row border-l-4 p-2">
              <div className="ml-1 w-fit">
                <h3 className="mt-4">{sprint.name}</h3>
                <p>
                  {dayjs(sprint.startDate).format('DD/MM')} -{' '}
                  {dayjs(sprint.endDate).format('DD/MM')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
