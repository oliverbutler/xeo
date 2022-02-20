import { CentredLoader } from '@xeo/ui';
import { Backlog } from 'components/Backlog/Backlog';
import { Content } from 'components/Content';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { GetBacklogRequest } from 'pages/api/backlog/[id]';
import { useQuery } from 'utils/api';

export function Index() {
  const router = useRouter();
  const { id: backlogId } = router.query;

  const { data, error, isLoading } = useQuery<GetBacklogRequest>(
    `/api/backlog/${backlogId}`
  );

  if (error) {
    return <div>Error Loading Backlog</div>;
  }

  if (isLoading) {
    return <CentredLoader />;
  }

  return data ? (
    <Content>
      <NextSeo
        title={`Xeo Backlog`}
        description={`View Xeo Backlog and add or remove members`}
      />
      <Backlog backlog={data.backlog} />
    </Content>
  ) : null;
}

export default Index;
