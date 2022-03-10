import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { NextRouter, useRouter } from 'next/router';
import { GetSprintColumnPlotData } from 'pages/api/team/[teamId]/sprint/[sprintId]/column-plot-data';
import { useQuery } from 'utils/api';
import { Error } from 'components/Error/Error';
import { Content } from 'components/Content';
import { ConditionalWrapper } from '@xeo/ui/lib/ConditionalWrapper/ConditionalWrapper';

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
    <div className="min-h-screen">
      <ConditionalWrapper
        condition={!isEmbed}
        wrapper={(c) => <Content>{c}</Content>}
      >
        <SprintInfo
          sprintData={data}
          publicMode={isEmbed}
          sprintId={sprintId}
        />
      </ConditionalWrapper>
    </div>
  );
};

export default PrivateSprintPage;
