import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Button, ButtonVariation } from '@xeo/ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetSprintColumnPlotData } from 'pages/api/sprint/[sprintId]/column-plot-data';
import { useCallback, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import { SprintGraph } from './SprintGraph/SprintGraph';
import { SprintStats } from './SprintStats/SprintStats';
import axios from 'axios';
import { PostUpdateSprintHistory } from 'pages/api/sprint/[sprintId]/update-history';
import { ScopedMutator } from 'swr/dist/types';
import { toast } from 'react-toastify';
import { UserAction, trackSprintAction } from 'utils/analytics';
import { NextSeo } from 'next-seo';
import Skeleton from 'react-loading-skeleton';
import { GraphControls } from './GraphControls/GraphControls';
import classNames from 'classnames';

dayjs.extend(relativeTime);

interface Props {
  sprintData: GetSprintColumnPlotData['response'] | null;
  publicMode: boolean;
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
      mutate(`/api/sprint/${sprintId}/column-plot-data`); // Tell SWR to update the data
    }
  } catch (error) {
    toast.error('Error fetching latest Sprint history, please try again later');
  }
};

export const SprintInfo: React.FunctionComponent<Props> = ({
  sprintData,
  publicMode,
  sprintId,
}) => {
  useEffect(() => {
    trackSprintAction({
      action: UserAction.SPRINT_VIEW,
      sprintId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useSWRConfig();

  const handleUpdateSprintHistory = useCallback(async () => {
    if (sprintData?.sprint) {
      if (!dayjs(sprintData.sprint.endDate).isBefore(dayjs(), 'minute')) {
        setIsLoading(true);
        await updateSprintHistory(sprintData.sprint.id, mutate);
        setIsLoading(false);
      } else {
        toast.warn("You can't update a sprint that's in the past!");
      }
    }
  }, [sprintData, mutate]);

  useEffect(() => {
    if (
      sprintData &&
      !dayjs(sprintData.sprint.endDate).isBefore(dayjs(), 'minute')
    ) {
      handleUpdateSprintHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showPointsNotStarted, setShowPointsNotStarted] = useState(true);

  const sprint = sprintData?.sprint;
  const sprintHistoryPlotData = sprintData?.sprintHistoryPlotData;

  return (
    <div className={classNames('w-full p-4', { 'p-4 sm:p-10': !publicMode })}>
      <NextSeo
        title={`Sprint - ${sprint?.name}`}
        description={`View ${sprint?.name}`}
      />

      <div className="flex flex-row justify-between">
        <div>
          <h1 className="mb-0">{sprint?.name ?? <Skeleton width={160} />}</h1>
        </div>

        <div>
          {publicMode ? (
            <a
              target={publicMode ? '_blank' : undefined}
              href={`/sprint/${sprintId}/edit`}
              rel="noreferrer"
              className="no-underline"
            >
              <Button variation={ButtonVariation.Secondary}>
                Edit
                <ExternalLinkIcon className="ml-2" height={25} width={25} />
              </Button>
            </a>
          ) : (
            <Button
              href={`/sprint/${sprintId}/edit`}
              variation={ButtonVariation.Secondary}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <p>{sprint?.sprintGoal ?? <Skeleton width={'100%'} count={2} />}</p>

          <SprintStats
            sprintHistoryPlotData={sprintHistoryPlotData}
            sprintId={sprintId}
          />
        </div>

        <div className="md:w-2/3 pt-4">
          <GraphControls
            publicMode={publicMode}
            isLoading={isLoading}
            setShowPointsNotStarted={setShowPointsNotStarted}
            showPointsNotStarted={showPointsNotStarted}
            handleUpdateSprintHistory={handleUpdateSprintHistory}
          />
          <SprintGraph
            sprint={sprint}
            plotData={sprintHistoryPlotData}
            showPointsNotStarted={showPointsNotStarted}
          />
        </div>
      </div>
      {/* {publicMode ? null : (
        <FeatureToggle>
          <SprintHistory sprintId={sprintId} />
        </FeatureToggle>
      )} */}
    </div>
  );
};
