import { Button, Select } from '@xeo/ui';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import Link from 'next/link';
import { GetSprintsRequest } from 'pages/api/sprint';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export const Sprint: React.FunctionComponent = () => {
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

  const currentlySelectedSprint = sprintOptions.find(
    (x) => x.value === selectedSprint
  );

  return (
    <div>
      <Select
        label="Select Sprint"
        options={sprintOptions}
        value={currentlySelectedSprint ?? defaultSprintForBacklog}
        onChange={(x) =>
          setSelectedSprint((x as typeof sprintOptions[0]).value)
        }
      />
      <Link href={`/sprint/${selectedSprint}`} passHref>
        <Button className="mt-4">Set Current Sprint</Button>
      </Link>
    </div>
  );
};
