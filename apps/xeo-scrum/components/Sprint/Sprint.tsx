import { Select } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { GetSprintsRequest } from 'pages/api/sprint';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (data) {
      setSelectedSprint(data.currentSprintId);
    }
  }, [data]);

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error.message}</div>;
  }

  const sprintOptions = data.sprints.map((sprint) => ({
    value: sprint.id,
    label: sprint.name,
  }));

  const defaultSprintForBacklog = sprintOptions.find(
    (x) => x.value === data.currentSprintId
  );

  return (
    <div>
      <Select
        label="Select Sprint"
        options={sprintOptions}
        value={defaultSprintForBacklog}
        onChange={(x) =>
          setSelectedSprint((x as typeof sprintOptions[0]).value)
        }
      />
      {selectedSprint ? <SprintInfo sprintId={selectedSprint} /> : null}
    </div>
  );
};
