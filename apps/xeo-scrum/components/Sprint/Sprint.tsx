import { Select } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { GetSprintsRequest } from 'pages/api/sprint';
import { useState } from 'react';
import useSWR from 'swr';
import { SprintInfo } from './SprintInfo/SprintInfo';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

export const Sprint: React.FunctionComponent<Props> = (props) => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);

  const { data, error } = useSWR<GetSprintsRequest['responseBody']>(
    '/api/sprint',
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error.message}</div>;
  }

  const sprintOptions = data.sprints.map((sprint) => ({
    value: sprint.notionSprintValue,
    label: sprint.name,
  }));

  return (
    <div>
      <Select
        label="Select Sprint"
        options={sprintOptions}
        onChange={(x) =>
          setSelectedSprint((x as typeof sprintOptions[0]).value)
        }
      />
      {selectedSprint ? <SprintInfo notionSprintId={selectedSprint} /> : null}
    </div>
  );
};
