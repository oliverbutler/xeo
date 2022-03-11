import { Sprint as PrismaSprint } from '@prisma/client';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import dayjs from 'dayjs';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { PreviousSprints } from './PreviousSprints/PreviousSprints';
import { SprintPreview } from './SprintPreview/SprintPreview';

type SprintsProps = {
  sprints: PrismaSprint[];
};

export const Sprints: React.FunctionComponent<SprintsProps> = ({ sprints }) => {
  const { me } = useCurrentUser();
  const currentTeam = me?.metadata?.defaultTeamId;

  const isSprintActive = (sprint: PrismaSprint) =>
    dayjs(sprint.endDate).isAfter(dayjs());

  const isSprintInactive = (sprint: PrismaSprint) => !isSprintActive(sprint);

  const activeSprints = sprints.filter(isSprintActive);
  const completeSprints = sprints.filter(isSprintInactive);

  return (
    <div className="pb-24">
      <div className="py-6 flex flex-row gap-4 items-center">
        <div>
          <Button
            href={`/team/${currentTeam}/sprint/create`}
            variation={ButtonVariation.Dark}
          >
            Create Sprint
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(activeSprints ?? [undefined, undefined]).map((sprint, index) => (
          <SprintPreview sprint={sprint} key={sprint?.id ?? index} />
        ))}
      </div>
      <h2>Past Sprints</h2>
      <PreviousSprints sprints={completeSprints} />
    </div>
  );
};
