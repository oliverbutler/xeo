import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import classNames from 'classnames';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import dayjs from 'dayjs';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useEffect, useState } from 'react';
import { DashboardSprint } from './DashboardSprint';

export const Dashboard: React.FunctionComponent = () => {
  const { team } = useCurrentTeam();
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const sprintsSortedByEndDate = team?.sprints.sort((a, b) => {
      return dayjs(b.endDate).diff(dayjs(a.endDate));
    });

    if (sprintsSortedByEndDate && sprintsSortedByEndDate.length > 0) {
      setSelectedSprintId(sprintsSortedByEndDate[0].id);
    }
  }, [team]);

  if (!team) {
    return <div>Loading</div>;
  }

  const selectedSprint = team.sprints.find((s) => s.id === selectedSprintId);

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
        {selectedSprint ? (
          <SettingsPanel className="col-span-2">
            <DashboardSprint sprint={selectedSprint} />
          </SettingsPanel>
        ) : (
          <div className="rounded-lg outline-dashed outline-8 col-span-2 flex items-center justify-center outline-dark-600/20 m-2">
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
        {team.sprints.length === 0 ? null : (
          <SettingsPanel className="col-span-1">
            <h3 className="my-0">Sprints</h3>

            {team.sprints.map((sprint, index) => (
              <div
                className={classNames(
                  'border-l-4 border-l-transparent pl-2 cursor-pointer hover:bg-dark-800',
                  {
                    'border-l-dark-100': selectedSprintId === sprint.id,
                  }
                )}
                onClick={() => setSelectedSprintId(sprint.id)}
              >
                {sprint.name} {index === 0 ? ' (current)' : ''}
              </div>
            ))}
          </SettingsPanel>
        )}
      </div>
    </div>
  );
};
