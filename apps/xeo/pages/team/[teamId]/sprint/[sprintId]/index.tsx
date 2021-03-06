import { SprintInfo } from 'components/Sprint/SprintInfo/SprintInfo';
import { NextRouter, useRouter } from 'next/router';
import { GetSprintColumnPlotData } from 'pages/api/team/[teamId]/sprint/[sprintId]/column-plot-data';
import { useQuery } from 'utils/api';
import { Error } from 'components/Error/Error';
import { isSprintEmbedded } from 'components/PrivateRoute';

const PrivateSprintPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId, teamId } = router.query;

  const isEmbed = isSprintEmbedded(router);

  const { data, error } = useQuery<GetSprintColumnPlotData>(
    `/api/team/${teamId}/sprint/${sprintId}/column-plot-data`
  );

  if (!sprintId || typeof sprintId !== 'string') {
    return <div>No sprint id</div>;
  }

  if (error) {
    return (
      <Error errorMessage="Error fetching the sprint, please try again!" />
    );
  }

  return (
    <div className="h-screen w-screen bg-white dark:bg-dark-950 p-2 overflow-x-hidden">
      <SprintInfo
        sprint={data?.sprint}
        plotData={data?.sprintHistoryPlotData ?? []}
        publicMode={isEmbed}
        sprintId={sprintId}
      />
    </div>
  );
};

export default PrivateSprintPage;
