import { Sprint } from '@prisma/client';
import { DataPlotType } from './chart';

export type DeveloperWithCapacity = {
  name: string;
  capacity: number[];
};

export const isDeveloperWithCapacityArray = (
  developers: unknown
): developers is DeveloperWithCapacity[] => {
  if (!Array.isArray(developers)) {
    return false;
  }

  return developers.every((developer): developer is DeveloperWithCapacity => {
    if (typeof developer !== 'object') {
      return false;
    }

    if (typeof developer.name !== 'string') {
      return false;
    }

    if (!Array.isArray(developer.capacity)) {
      return false;
    }

    return developer.capacity.every(
      (capacity: any): capacity is number => typeof capacity === 'number'
    );
  });
};

export enum SprintStatus {
  ACTIVE,
  COMPLETED,
}

export type ActiveSprintWithPlotData = {
  status: SprintStatus.ACTIVE;
  sprint: Sprint;
  plotData: DataPlotType[];
};

export type CompleteSprintWithoutPlotData = {
  status: SprintStatus.COMPLETED;
  sprint: Sprint;
};

export type SprintWithPlotData =
  | ActiveSprintWithPlotData
  | CompleteSprintWithoutPlotData;

export const isActiveSprintWithPlotData = (
  sprintWithPlotData: SprintWithPlotData
): sprintWithPlotData is ActiveSprintWithPlotData =>
  sprintWithPlotData.status === SprintStatus.ACTIVE;

export const isCompleteSprintWithoutPlotData = (
  sprintWithPlotData: SprintWithPlotData
): sprintWithPlotData is CompleteSprintWithoutPlotData =>
  sprintWithPlotData.status === SprintStatus.COMPLETED;
