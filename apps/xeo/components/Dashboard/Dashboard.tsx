import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
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
        rightContent={
          <Button
            href={`/team/${team.id}/sprint/create`}
            variation={ButtonVariation.Dark}
          >
            Create Sprint
          </Button>
        }
        border
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-6">
        {latestSprint ? (
          <SettingsPanel className="col-span-2">
            <DashboardSprint sprint={latestSprint} />
          </SettingsPanel>
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
