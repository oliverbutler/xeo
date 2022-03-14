import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { DashboardSprint } from './DashboardSprint';

export const Dashboard: React.FunctionComponent = () => {
  const { team } = useCurrentTeam();

  if (!team) {
    return <div>Loading</div>;
  }

  const latestSprint = team.sprints[team.sprints.length - 1];

  return (
    <div>
      <PageHeader
        title={`${team.name} (${team.shortName})`}
        subtitle="View the current progress of your team"
        border
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-6">
        {latestSprint ? (
          <div className="rounded-lg shadow-lg bg-white dark:bg-dark-950 col-span-3">
            <DashboardSprint sprint={latestSprint} />
          </div>
        ) : (
          <div className="rounded-lg outline-dashed outline-8 col-span-3 flex items-center justify-center outline-dark-600/20 m-2">
            <div className="my-24 flex flex-col items-center">
              <h3>No Current Sprint</h3>
              <div>
                <Button
                  variation={ButtonVariation.Dark}
                  href={`/team/${team.id}/sprint/create`}
                >
                  Create Sprint
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
