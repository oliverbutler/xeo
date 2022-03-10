import { Sprint } from '@prisma/client';
import { GetSprintColumnPlotData } from 'pages/api/team/[teamId]/sprint/[sprintId]/column-plot-data';
import { toast } from 'react-toastify';
import { useQuery } from 'utils/api';
import { DataPlotType } from 'utils/sprint/chart';

interface Output {
  sprint: Sprint | null;
  plotData: DataPlotType[];
}

export const useSprintPlotData = (
  sprintId: Sprint['id'] | undefined
): Output => {
  const { data, error, isLoading } = useQuery<GetSprintColumnPlotData>(
    `/api/sprint/${sprintId}/column-plot-data`,
    !sprintId,
    { revalidateIfStale: false, revalidateOnFocus: false }
  );

  if (error) {
    toast.error(error?.message ?? 'Error fetching sprint data');
    return { sprint: null, plotData: [] };
  }

  if (isLoading || !data) {
    return { sprint: null, plotData: [] };
  }

  return { sprint: data.sprint, plotData: data.sprintHistoryPlotData };
};
