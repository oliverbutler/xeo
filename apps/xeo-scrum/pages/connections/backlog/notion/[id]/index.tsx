import { Backlog } from 'components/Backlog/Backlog';
import { useRouter } from 'next/router';
import { GetBacklogRequest } from 'pages/api/backlog/[id]';
import { useQuery } from 'utils/api';
import { CentredLoader } from '../../../../../../../libs/ui/src/lib/Animate/CentredLoader/CentredLoader';

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

  return data ? <Backlog backlog={data.backlog} /> : null;
}

export default Index;
