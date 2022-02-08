import { Button, ButtonVariation } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { SprintEdit } from 'components/Sprint/SprintEdit/SprintEdit';
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

  return (
    <div className="w-full p-10">
      <div className="flex flex-row justify-between">
        <h1>Update Sprint - {data.sprint.name}</h1>
        <div>
          <Button href="/sprint" variation={ButtonVariation.Secondary}>
            Back
          </Button>
        </div>
      </div>
      <SprintEdit sprint={data.sprint} />
    </div>
  );
};

export default SprintEditPage;
