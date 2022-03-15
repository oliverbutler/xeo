import dayjs from 'dayjs';
import { DataPlotLine, DataPlotType } from 'utils/sprint/chart';
import { Sprint } from '@prisma/client';

export function getChartData(
  plotData: DataPlotType[] | undefined,
  smallGraph: boolean | undefined,
  sprint: Sprint | undefined
) {
  const lowestValueInPlot = plotData
    ? Math.min(
        ...plotData.map((plot) =>
          Math.min(
            plot[DataPlotLine.CAPACITY] ?? 0,
            plot[DataPlotLine.POINTS_LEFT] ?? 0,
            plot[DataPlotLine.POINTS_DONE_INC_VALIDATE] ?? 0,
            plot[DataPlotLine.EXPECTED_POINTS] ?? 0
          )
        )
      )
    : 0;

  const highestValueInPlot = plotData
    ? Math.max(
        ...plotData.map((plot) =>
          Math.max(
            plot[DataPlotLine.CAPACITY] ?? 0,
            plot[DataPlotLine.POINTS_LEFT] ?? 0,
            plot[DataPlotLine.POINTS_DONE_INC_VALIDATE] ?? 0,
            plot[DataPlotLine.EXPECTED_POINTS] ?? 0
          )
        )
      )
    : 100;

  const getAllFactorsOf10BetweenValues = (
    lowestValue: number,
    highestValue: number,
    factor: number
  ): number[] => {
    const lowestFactor = Math.floor(lowestValue / factor) * factor;
    const highestFactor = Math.ceil(highestValue / factor) * factor;

    const factors = [];

    for (let i = lowestFactor; i <= highestFactor; i += factor) {
      factors.push(i);
    }

    return factors;
  };

  const axisFactor = highestValueInPlot - lowestValueInPlot < 80 ? 10 : 20;

  const yAxisTicks = getAllFactorsOf10BetweenValues(
    lowestValueInPlot,
    highestValueInPlot,
    axisFactor
  );

  const xAxisTicks = smallGraph
    ? [
        dayjs(sprint?.startDate).toISOString(),
        dayjs(sprint?.endDate).toISOString(),
      ]
    : undefined;
  return { xAxisTicks, yAxisTicks };
}
