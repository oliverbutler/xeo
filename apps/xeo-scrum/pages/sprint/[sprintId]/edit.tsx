import { Button, ButtonVariation, CentredLoader } from '@xeo/ui';
import { fetcher } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';
import { SprintEdit } from 'components/Sprint/SprintEdit/SprintEdit';
import { NextSeo } from 'next-seo';
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
    return (
      <div>
        <CentredLoader />
      </div>
    );
  }

  if (error || !data) {
    return <div>Error Loading Sprint</div>;
  }

  return (
    <div className="w-full p-10">
      <NextSeo
        title={`Edit Sprint - ${data.sprint.name}`}
        description={`Edit Sprint - ${data.sprint.name}`}
      />
      <div className="flex flex-row justify-between">
        <h1>Update Sprint - {data.sprint.name}</h1>
        <div>
          <Button href="/" variation={ButtonVariation.Secondary}>
            Back
          </Button>
        </div>
      </div>
      <SprintEdit sprint={data.sprint} />
    </div>
  );
};

export default SprintEditPage;
