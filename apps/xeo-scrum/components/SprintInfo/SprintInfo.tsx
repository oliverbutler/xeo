import { Button, ButtonVariation } from '@xeo/ui';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { ProductBacklog } from 'utils/notion/backlog';
import { SprintGraph } from './SprintGraph/SprintGraph';
import { SprintStats } from './SprintStats/SprintStats';

interface Props {
  sprintData: GetSprintHistoryRequest['responseBody'];
  productBacklog: ProductBacklog;
}

export const SprintInfo: React.FunctionComponent<Props> = ({
  sprintData,
  productBacklog,
}) => {
  return (
    <div className="p-10 w-full">
      <div className="flex flex-row justify-between">
        <h1>Sprint - {sprintData.sprint.name}</h1>
        <div>
          <Button variation={ButtonVariation.Secondary}>Edit</Button>
        </div>
      </div>
      <SprintStats productBacklog={productBacklog} />
      <h2>Burn Down Chart</h2>
      <SprintGraph sprintData={sprintData} />
      <h2>Tickets</h2>
      <div>
        {productBacklog.tickets.map((ticket) => (
          <div key={ticket.notionId}>
            {ticket.title} {ticket.points}{' '}
            {ticket.notionStatusLink?.notionStatusName}
          </div>
        ))}
      </div>
    </div>
  );
};
