import { ChartBarIcon, StarIcon } from '@heroicons/react/outline';
import { ProductBacklog } from 'utils/notion/backlog';
import { SprintStat } from './SprintStat';

interface Props {
  productBacklog: ProductBacklog;
}

export const SprintStats: React.FunctionComponent<Props> = ({
  productBacklog,
}) => {
  const totalPointsInSprint = productBacklog.tickets.reduce((acc, ticket) => {
    acc += ticket.points ?? 0;
    return acc;
  }, 0);

  const totalPointsInProgress = productBacklog.tickets.reduce((acc, ticket) => {
    acc +=
      ticket?.notionStatusLink?.status === 'IN_PROGRESS' && ticket.points
        ? ticket.points
        : 0;
    return acc;
  }, 0);

  const totalPointsDone = productBacklog.tickets.reduce((acc, ticket) => {
    acc +=
      ticket?.notionStatusLink?.status === 'DONE' && ticket.points
        ? ticket.points
        : 0;
    return acc;
  }, 0);

  const percentDone = Math.round((totalPointsDone / totalPointsInSprint) * 100);
  const numberOfPointsLeft = totalPointsInSprint - totalPointsDone;

  return (
    <div className="flex flex-row flex-wrap">
      <SprintStat
        icon={
          <ChartBarIcon height={40} width={40} className="stroke-primary-300" />
        }
        title="Progress"
        value={
          <p>
            {percentDone}% - {numberOfPointsLeft} Points Left
          </p>
        }
      />
      <SprintStat
        icon={<StarIcon height={40} width={40} className="stroke-yellow-300" />}
        title="Success"
        value={<p>On Track +1.5 ✅</p>}
      />
    </div>
  );
};
