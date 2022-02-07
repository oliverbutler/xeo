import { ChartBarIcon, StarIcon } from '@heroicons/react/outline';
import { DataPlotType } from 'utils/sprint/chart';
import { SprintStat } from './SprintStat';

interface Props {
  sprintHistoryPlotData: DataPlotType[];
  sprintId: string;
}

export const SprintStats: React.FunctionComponent<Props> = ({
  sprintHistoryPlotData,
}) => {
  const lastHistoryPoint =
    sprintHistoryPlotData[sprintHistoryPlotData.length - 1];

  if (!lastHistoryPoint) {
    return null;
  }

  const totalPointsInSprint = lastHistoryPoint['Scope'];
  const totalPointsDone = totalPointsInSprint - lastHistoryPoint['Points Left'];
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
        value={<p>Unknown</p>}
      />
    </div>
  );
};
