import { Button, ButtonVariation } from '@xeo/ui';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { SprintGraph } from './SprintGraph';

interface Props {
  sprintData: GetSprintHistoryRequest['responseBody'];
}

export const SprintInfo: React.FunctionComponent<Props> = ({ sprintData }) => {
  return (
    <div className="p-10 w-full">
      <div className="flex flex-row justify-between">
        <h1>Sprint - {sprintData.sprint.name}</h1>
        <div>
          <Button variation={ButtonVariation.Secondary}>Edit</Button>
        </div>
      </div>
      <h2>Burn Down Chart</h2>
      <SprintGraph sprintData={sprintData} />
    </div>
  );
};
