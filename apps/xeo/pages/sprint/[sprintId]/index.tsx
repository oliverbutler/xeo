import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { NextRouter, useRouter } from 'next/router';
import { GetSprintColumnPlotData } from 'pages/api/sprint/[sprintId]/column-plot-data';
import { useQuery } from 'utils/api';
import { CentredLoader } from '@xeo/ui';
import { Error } from 'components/Error/Error';

export const isSprintEmbedded = (router: NextRouter) =>
  router.query.embed === '1';

const PrivateSprintPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId } = router.query;

  const isEmbed = isSprintEmbedded(router);

  const { data, error } = useQuery<GetSprintColumnPlotData>(
    `/api/sprint/${sprintId}/column-plot-data`
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
    <SprintInfo sprintData={data} publicMode={isEmbed} sprintId={sprintId} />
  );
};

export default PrivateSprintPage;
