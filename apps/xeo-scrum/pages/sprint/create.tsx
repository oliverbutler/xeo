import { Button, ButtonVariation, CentredLoader } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { SprintCreate } from 'components/Sprint/SprintCreate/SprintCreate';
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
      <div className="flex flex-row justify-between">
        <h1>Create Sprint</h1>
        <div>
          <Button href="/" variation={ButtonVariation.Secondary}>
            Back
          </Button>
        </div>
      </div>
      <SprintCreate backlogs={dataBacklogs.backlogs} />
    </div>
  );
}

export default Create;
