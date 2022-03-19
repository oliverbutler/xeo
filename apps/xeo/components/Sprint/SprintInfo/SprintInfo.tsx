import { ExternalLinkIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetSprintColumnPlotData } from 'pages/api/team/[teamId]/sprint/[sprintId]/column-plot-data';
import { useCallback, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import { SprintStats } from './SprintStats/SprintStats';
import axios from 'axios';
import { PostUpdateSprintHistory } from 'pages/api/team/[teamId]/sprint/[sprintId]/update-history';
import { ScopedMutator } from 'swr/dist/types';
import { toast } from 'react-toastify';
import { UserAction, trackSprintAction } from 'utils/analytics';
import { NextSeo } from 'next-seo';
import Skeleton from 'react-loading-skeleton';
import { GraphControls } from './GraphControls/GraphControls';
import classNames from 'classnames';
import Button, { ButtonColour } from '@xeo/ui/lib/Button/Button';
import { DataPlotType } from 'utils/sprint/chart';
import { Sprint } from '@prisma/client';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { SprintGraph } from './SprintGraph/SprintGraph';
import { SprintStatusBadge } from 'components/Team/TeamSelector/TeamSelector';

dayjs.extend(relativeTime);

interface Props {
  sprint: Sprint | undefined;
  plotData: DataPlotType[];
  publicMode: boolean;
  sprintId: string;
}

const updateSprintHistory = async ({
  sprintId,
  teamId,
  mutate,
}: {
  sprintId: string;
  teamId: string;
  mutate: ScopedMutator<unknown>;
}) => {
  const body: PostUpdateSprintHistory['request'] = { sprintId };

  try {
    const { data } = await axios.post<PostUpdateSprintHistory['response']>(
      `/api/team/${teamId}/sprint/${sprintId}/update-history`,
      body
    );

    if (data.updatedSprintPlotData) {
      mutate(`/api/team/${teamId}/sprint/${sprintId}/column-plot-data`);
    }
  } catch (error) {
    toast.error('Error fetching latest Sprint history, please try again later');
  }
};

export const SprintInfo: React.FunctionComponent<Props> = ({
  sprint,
  plotData,
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
  const { team } = useCurrentTeam();

  const { mutate } = useSWRConfig();

  const handleUpdateSprintHistory = useCallback(async () => {
    if (sprint && team) {
      if (!dayjs(sprint.endDate).isBefore(dayjs(), 'minute')) {
        setIsLoading(true);
        await updateSprintHistory({
          sprintId: sprint.id,
          teamId: team?.id,
          mutate,
        });
        setIsLoading(false);
      } else {
        toast.warn("You can't update a sprint that's in the past!");
      }
    }
  }, [plotData, mutate, team]);

  const [showPointsNotStarted, setShowPointsNotStarted] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <div>
        <NextSeo
          title={`Sprint - ${sprint?.name}`}
          description={`View ${sprint?.name}`}
        />

        <div className="flex flex-row justify-between">
          <div>
            <h2 className="my-0 flex flex-row items-center">
              {sprint?.name ?? <Skeleton width={160} />}{' '}
              {sprint ? (
                <div className="ml-2">
                  <SprintStatusBadge sprint={sprint} />
                </div>
              ) : null}
            </h2>
            <p className="mb-2">
              {sprint?.sprintGoal ?? <Skeleton width={'70%'} count={1} />}
            </p>
          </div>
          <div>
            <Button
              href={`/team/${team?.id}/sprint/${sprintId}/edit`}
              colour={ButtonColour.Dark}
              variation="tertiary"
            >
              Edit
            </Button>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <SprintStats sprintHistoryPlotData={plotData} sprintId={sprintId} />
          <GraphControls
            sprint={sprint}
            publicMode={publicMode}
            isLoading={isLoading}
            setShowPointsNotStarted={setShowPointsNotStarted}
            showPointsNotStarted={showPointsNotStarted}
            handleUpdateSprintHistory={handleUpdateSprintHistory}
          />
        </div>
      </div>
      <SprintGraph
        sprint={sprint}
        plotData={plotData}
        showPointsNotStarted={showPointsNotStarted}
      />
      {/* {publicMode ? null : (
        <FeatureToggle>
          <SprintHistory sprintId={sprintId} />
        </FeatureToggle>
      )} */}
    </div>
  );
};
