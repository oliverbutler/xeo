import { Button, ButtonVariation, CentredLoader, Alert } from '@xeo/ui';
import classNames from 'classnames';
import { fetcher } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';
import { SprintCreate } from 'components/Sprint/SprintCreate/SprintCreate';
import { NextSeo } from 'next-seo';
import { GetBacklogsRequest } from 'pages/api/backlog';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function Create() {
  const { data: dataBacklogs, error: errorBacklogs } = useSWR<
    GetBacklogsRequest['responseBody'],
    string
  >('/api/backlog', fetcher);

  if (!dataBacklogs && !errorBacklogs) {
    return (
      <div>
        <CentredLoader />
      </div>
    );
  }

  if (errorBacklogs || !dataBacklogs) {
    toast.error('Unable to fetch your Backlogs');
    return <div>Error Loading Backlogs</div>;
  }

  return (
    <div className="w-full p-10">
      <NextSeo title="Create Sprint" description="Create a new Sprint in Xeo" />
      <div className="flex flex-row justify-between">
        <h1>Create Sprint</h1>
        <div>
          <Button href="/" variation={ButtonVariation.Secondary}>
            Back
          </Button>
        </div>
      </div>
      {dataBacklogs.backlogs.length === 0 && (
        <Alert variation="warning">
          You currently have no Backlogs. Please join or create one before
          creating a sprint!
        </Alert>
      )}
      <div
        className={classNames({
          'opacity-30': dataBacklogs.backlogs.length === 0,
        })}
      >
        <SprintCreate backlogs={dataBacklogs.backlogs} />
      </div>
    </div>
  );
}

export default Create;
