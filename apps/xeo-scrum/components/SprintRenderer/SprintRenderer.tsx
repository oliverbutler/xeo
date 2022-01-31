import { Sprint } from '@prisma/client';
import { Ticket } from 'utils/notion/backlog';
import { PlusCircleIcon } from '@heroicons/react/outline';

interface SprintRendererProps {
  sprint: Sprint | undefined;
  notionSprintSelect: Ticket['notionSprintSelect'];
}

export const SprintRenderer: React.FunctionComponent<SprintRendererProps> = ({
  sprint,
  notionSprintSelect,
}) => {
  return (
    <div className="bg-dark-700 rounded-md  flex justify-center items-center cursor-pointer">
      {sprint ? (
        <span>{sprint.name}</span>
      ) : notionSprintSelect ? (
        <>
          <PlusCircleIcon height={20} className="mr-1" />
          <span>
            {'"'}
            {notionSprintSelect.name}
            {'"'}
          </span>
        </>
      ) : (
        <span></span>
      )}
    </div>
  );
};
