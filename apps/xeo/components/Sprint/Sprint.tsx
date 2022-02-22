import { Input, Button, ButtonVariation, Alert } from '@xeo/ui';
import dayjs from 'dayjs';
import { GetSprintsRequest } from 'pages/api/sprint';
import { toast } from 'react-toastify';
import { useQuery } from 'utils/api';
import { SprintWithPlotData } from 'utils/sprint/utils';
import { PreviousSprints } from './PreviousSprints/PreviousSprints';
import { SprintPreview } from './SprintPreview/SprintPreview';

export const Sprint: React.FunctionComponent = () => {
  const { data, error, isLoading } = useQuery<GetSprintsRequest>('/api/sprint');

  if (error) {
    toast.error("Couldn't fetch sprints");
    return null;
  }

  const usersSprints =
    data?.backlogs.reduce((acc, { sprints }) => {
      return [...acc, ...sprints];
    }, [] as SprintWithPlotData[]) ?? [];

  const isSprintActive = (sprint: SprintWithPlotData) =>
    dayjs(sprint.sprint.endDate).isAfter(dayjs());

  const isSprintInactive = (sprint: SprintWithPlotData) =>
    !isSprintActive(sprint);

  const activeSprints = usersSprints.filter(isSprintActive);
  const completeSprints = usersSprints.filter(isSprintInactive);

  return (
    <div className="pb-24">
      <div className="py-6 flex flex-row gap-4 items-center">
        <Input className="flex-grow" label="" placeholder="Search..." />
        <div>
          <Button href="/sprint/create" variation={ButtonVariation.Dark}>
            Create Sprint
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(activeSprints.length === 0 && isLoading
          ? [
              { sprint: undefined, plotData: [] },
              { sprint: undefined, plotData: [] },
            ]
          : activeSprints
        ).map(({ sprint, plotData }, index) => (
          <SprintPreview
            sprint={sprint}
            plotData={plotData}
            key={sprint?.id ?? index}
          />
        ))}
      </div>
      <h2>Past Sprints</h2>
      <PreviousSprints sprints={completeSprints} />
    </div>
  );
};
