import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import Button, { ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Content } from 'components/Content';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SprintEdit } from 'components/Sprint/SprintEdit/SprintEdit';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { GetSprintRequest } from 'pages/api/team/[teamId]/sprint/[sprintId]';
import { toast } from 'react-toastify';
import { useQuery } from 'utils/api';

export const SprintEditPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId, teamId } = router.query;

  const { data, error } = useQuery<GetSprintRequest>(
    `/api/team/${teamId}/sprint/${sprintId}`
  );

  if (!sprintId || typeof sprintId !== 'string') {
    toast.error('Invalid sprint id');
    return null;
  }

  if (error) {
    return <div>Error Loading Sprint</div>;
  }

  return (
    <div>
      <PageHeader
        title={`Update Sprint`}
        rightContent={
          <Button href={`/team/${teamId}`} colour={ButtonColour.Secondary}>
            Back
          </Button>
        }
        border
      />
      <Content className="my-10">
        <NextSeo
          title={`Edit Sprint  ${
            data?.sprint.name ?? '- ' + data?.sprint.name
          }`}
          description={`Edit Sprint  ${
            data?.sprint.name ?? '- ' + data?.sprint.name
          }`}
        />
        {data ? <SprintEdit sprint={data.sprint} /> : <CentredLoader />}
      </Content>
    </div>
  );
};

export default SprintEditPage;
