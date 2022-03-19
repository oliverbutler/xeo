import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import classNames from 'classnames';
import { Badge } from 'components/Badge/Badge';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { SprintStatusBadge } from 'components/Team/TeamSelector/TeamSelector';
import dayjs from 'dayjs';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { DashboardSprint } from './DashboardSprint';

export const Dashboard: React.FunctionComponent = () => {
  const { team, currentSprint, setCurrentSprintId, activeSprint } =
    useCurrentTeam();

  if (!team) {
    return <CentredLoader />;
  }

  return (
    <div>
      <PageHeader
        title={`${team.name} (${team.shortName})`}
        subtitle="View the current progress of your team"
        rightContent={
          <Button
            href={`/team/${team.id}/sprint/create`}
            colour={ButtonColour.Dark}
          >
            Create Sprint
          </Button>
        }
        border
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-6">
        {currentSprint ? (
          <SettingsPanel className="col-span-2">
            <DashboardSprint sprint={currentSprint} />
          </SettingsPanel>
        ) : (
          <div className="rounded-lg outline-dashed outline-8 col-span-2 flex items-center justify-center outline-dark-600/20 m-2">
            <div className="my-24 flex flex-col items-center">
              <h3>No Current Sprint</h3>
              <div>
                <Button
                  colour={ButtonColour.Dark}
                  href={`/team/${team.id}/sprint/create`}
                >
                  Create Sprint
                </Button>
              </div>
            </div>
          </div>
        )}
        {team.sprints.length === 0 ? null : (
          <SettingsPanel className="col-span-1">
            <h3 className="my-0">Sprints</h3>

            {team.sprints.reverse().map((sprint, index) => (
              <div
                className={classNames(
                  'border-l-4 border-l-transparent pl-2 flex flex-row items-center cursor-pointer hover:bg-dark-200 dark:hover:bg-dark-800',
                  {
                    'border-l-dark-100': currentSprint?.id === sprint.id,
                  }
                )}
                onClick={() => setCurrentSprintId(sprint.id)}
              >
                <span className="mr-2">
                  {sprint.name} - {dayjs(sprint.startDate).format('DD/MM')}
                </span>
                <div>
                  <SprintStatusBadge sprint={sprint} />
                </div>
              </div>
            ))}
          </SettingsPanel>
        )}
      </div>
    </div>
  );
};
