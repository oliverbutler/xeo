import { Sprint as PrismaSprint } from '@prisma/client';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import dayjs from 'dayjs';
import { GetSprintsRequest } from 'pages/api/sprint';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from 'utils/api';
import { PreviousSprints } from './PreviousSprints/PreviousSprints';
import { SprintPreview } from './SprintPreview/SprintPreview';

export const Sprint: React.FunctionComponent = () => {
  const { data, error } = useQuery<GetSprintsRequest>('/api/sprint');

  const [searchText, setSearchText] = useState('');

  if (error) {
    toast.error("Couldn't fetch sprints");
    return null;
  }

  const userSprints = data?.backlogs.map(({ sprints }) => sprints).flat() ?? [];

  const isSprintActive = (sprint: PrismaSprint) =>
    dayjs(sprint.endDate).isAfter(dayjs());

  const isSprintInactive = (sprint: PrismaSprint) => !isSprintActive(sprint);

  const filteredSprints = userSprints.filter((sprint) =>
    sprint.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeSprints = filteredSprints.filter(isSprintActive);
  const completeSprints = filteredSprints.filter(isSprintInactive);

  return (
    <div className="pb-24">
      <div className="py-6 flex flex-row gap-4 items-center">
        <Input
          className="flex-grow"
          label=""
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div>
          <Button href="/sprint/create" variation={ButtonVariation.Dark}>
            Create Sprint
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(activeSprints ?? [undefined, undefined]).map((sprint, index) => (
          <SprintPreview sprint={sprint} key={sprint?.id ?? index} />
        ))}
      </div>
      <h2>Past Sprints</h2>
      <PreviousSprints sprints={completeSprints} />
    </div>
  );
};
