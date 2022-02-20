import { Sprint } from '@prisma/client';
import { ConditionalWrapper } from '@xeo/ui';
import { SprintGraph } from 'components/SprintInfo/SprintGraph/SprintGraph';
import dayjs from 'dayjs';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { DataPlotType } from 'utils/sprint/chart';

interface Props {
  sprint: Sprint | undefined;
  plotData: DataPlotType[];
}

export const SprintPreview: React.FunctionComponent<Props> = ({
  sprint,
  plotData,
}) => {
  return (
    <ConditionalWrapper
      condition={!!sprint}
      wrapper={(c) => (
        <Link href="/sprint/[sprintId]" as={`/sprint/${sprint?.id}`} passHref>
          {c}
        </Link>
      )}
    >
      <div className=" bg-white dark:bg-dark-950 flex cursor-pointer flex-col p-4 shadow-md rounded-md  transition-all hover:shadow-md">
        <div className="ml-1 w-fit flex-grow">
          <h3 className="my-0">{sprint?.name ?? <Skeleton width={120} />}</h3>
          <small>
            {sprint ? (
              <>
                {dayjs(sprint.startDate).format('DD/MM')} -{' '}
                {dayjs(sprint.endDate).format('DD/MM')}
              </>
            ) : (
              <Skeleton width={60} />
            )}
          </small>
        </div>
        <div className="h-52 w-full">
          <SprintGraph
            sprint={sprint}
            plotData={plotData}
            showPointsNotStarted
            smallGraph
          />
        </div>
      </div>
    </ConditionalWrapper>
  );
};
