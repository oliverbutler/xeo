import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Content } from 'components/Content';
import { SprintEdit } from 'components/Sprint/SprintEdit/SprintEdit';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { GetSprintRequest } from 'pages/api/sprint/[sprintId]';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { useQuery } from 'utils/api';

export const SprintEditPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId } = router.query;

  const { data, error } = useQuery<GetSprintRequest>(`/api/sprint/${sprintId}`);

  if (!sprintId || typeof sprintId !== 'string') {
    toast.error('Invalid sprint id');
    return null;
  }

  if (error) {
    return <div>Error Loading Sprint</div>;
  }

  return (
    <div className="min-h-screen">
      <Content className="my-10">
        <NextSeo
          title={`Edit Sprint  ${
            data?.sprint.name ?? '- ' + data?.sprint.name
          }`}
          description={`Edit Sprint  ${
            data?.sprint.name ?? '- ' + data?.sprint.name
          }`}
        />
        <div className="flex flex-row justify-between">
          <h1>
            Update Sprint - {data?.sprint.name ?? <Skeleton width={60} />}
          </h1>
          <div>
            <Button href="/" variation={ButtonVariation.Secondary}>
              Back
            </Button>
          </div>
        </div>
        {data ? <SprintEdit sprint={data.sprint} /> : <CentredLoader />}
      </Content>
    </div>
  );
};

export default SprintEditPage;
