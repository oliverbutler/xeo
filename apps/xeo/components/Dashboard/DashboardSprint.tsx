import { Sprint } from '@prisma/client';
import { SprintInfo } from 'components/Sprint/SprintInfo/SprintInfo';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { GetSprintColumnPlotData } from 'pages/api/team/[teamId]/sprint/[sprintId]/column-plot-data';
import { useQuery } from 'utils/api';

interface Props {
  sprint: Sprint;
}

export const DashboardSprint: React.FunctionComponent<Props> = ({ sprint }) => {
  const { team } = useCurrentTeam();

  const { data } = useQuery<GetSprintColumnPlotData>(
    `/api/team/${team?.id}/sprint/${sprint.id}/column-plot-data`,
    !team
  );

  return (
    <div style={{ height: '50vh', minHeight: 300 }}>
      <SprintInfo
        publicMode={false}
        sprint={sprint}
        plotData={data?.sprintHistoryPlotData ?? []}
        sprintId={sprint.id}
      />
    </div>
  );
};
