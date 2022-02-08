import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { SprintEdit } from 'components/SprintEdit/SprintEdit';
import { useRouter } from 'next/router';
import { GetSprintRequest } from 'pages/api/sprint/[sprintId]';
import useSWR from 'swr';

export const SprintEditPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId } = router.query;

  const { data, error } = useSWR<GetSprintRequest['responseBody'], string>(
    `/api/sprint/${sprintId}`,
    fetcher
  );

  if (!sprintId || typeof sprintId !== 'string') {
    return <div>Invalid sprint id</div>;
  }

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error}</div>;
  }

  return <SprintEdit sprint={data.sprint} />;
};

export default SprintEditPage;
