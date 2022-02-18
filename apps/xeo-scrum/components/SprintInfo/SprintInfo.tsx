import {
  BeakerIcon,
  ClipboardCopyIcon,
  ExternalLinkIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { Button, ButtonVariation, Clickable } from '@xeo/ui';
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
import { DarkModeButton } from 'components/DarkModeButton/DarkModeButton';
import { UserAction, trackSprintAction } from 'utils/analytics';
import { NextSeo } from 'next-seo';
import { SprintHistory } from './SprintHistory/SprintHistory';
import { FeatureToggle } from 'components/FeatureToggle/FeatureToggle';

dayjs.extend(relativeTime);

interface Props {
  sprintData: GetSprintColumnPlotData['response'];
  publicMode: boolean;
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
}) => {
  useEffect(() => {
    trackSprintAction({
      action: UserAction.SPRINT_VIEW,
      sprintId: sprintData.sprint.id,
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

  const { sprint, sprintHistoryPlotData } = sprintData;

  return (
    <div className="w-full p-4 sm:p-10">
      <NextSeo
        title={`Sprint - ${sprint.name}`}
        description={`View ${sprint.name}`}
      />

      <div className="flex flex-row justify-between">
        <div>
          <h1 className="mb-0">{sprint.name}</h1>
        </div>

        <div>
          {publicMode ? (
            <a
              target={publicMode ? '_blank' : undefined}
              href={`/sprint/${sprint.id}/edit`}
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
              href={`/sprint/${sprint.id}/edit`}
              variation={ButtonVariation.Secondary}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <p className="hidden sm:block">{sprint.sprintGoal}</p>

      <SprintStats
        sprintHistoryPlotData={sprintHistoryPlotData}
        sprintId={sprintData.sprint.id}
      />
      <div className="flex flex-row items-end justify-between">
        <div className="flex w-full flex-row justify-end gap-2">
          {!publicMode && (
            <Clickable
              onClick={() => {
                navigator.clipboard.writeText(`${window.location}?embed=1`);
                toast.info('Embeddable link copied to Clipboard');
              }}
            >
              <ClipboardCopyIcon height={20} width={20} />
            </Clickable>
          )}
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
          {publicMode && <DarkModeButton />}
        </div>
      </div>

      <SprintGraph
        sprint={sprint}
        plotData={sprintHistoryPlotData}
        showPointsNotStarted={showPointsNotStarted}
      />
      <FeatureToggle>
        <SprintHistory sprint={sprint} />
      </FeatureToggle>
    </div>
  );
};
