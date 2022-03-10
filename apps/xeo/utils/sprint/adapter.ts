import { Sprint, SprintHistory, SprintStatusHistory } from '@prisma/client';
import { prisma } from 'utils/db/db';
import { DeveloperWithCapacity, isDeveloperWithCapacityArray } from './utils';

export type UpdateSprint = Partial<CreateSprint>;

export interface CreateSprint {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  notionSprintValue: string;
  teamSpeed: number;
  dayStartTime: string;
  developers: DeveloperWithCapacity[];
}

export const updateSprint = async (
  sprintId: string,
  input: UpdateSprint
): Promise<Sprint> => {
  if (!isDeveloperWithCapacityArray(input.developers)) {
    throw new Error(
      `input.developers is malformed, must be an array of objects ${JSON.stringify(
        input.developers
      )}`
    );
  }

  const sprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: {
      name: input.name,
      sprintGoal: input.goal,
      startDate: input.startDate,
      endDate: input.endDate,
      notionSprintValue: input.notionSprintValue,
      teamSpeed: input.teamSpeed,
      dailyStartTime: input.dayStartTime,
      sprintDevelopersAndCapacity: input.developers,
    },
  });

  return sprint;
};

export const createSprint = async (
  teamId: string,
  input: CreateSprint
): Promise<Sprint> => {
  if (!isDeveloperWithCapacityArray(input.developers)) {
    throw new Error(
      `input.developers is malformed, must be an array of objects ${JSON.stringify(
        input.developers
      )}`
    );
  }

  const sprint = await prisma.sprint.create({
    data: {
      name: input.name,
      sprintGoal: input.goal,
      startDate: input.startDate,
      endDate: input.endDate,
      notionSprintValue: input.notionSprintValue,
      teamSpeed: input.teamSpeed,
      dailyStartTime: input.dayStartTime,
      sprintDevelopersAndCapacity: input.developers,
      team: {
        connect: {
          id: teamId,
        },
      },
    },
  });
  return sprint;
};

export const getSprintForTeam = async (
  sprintId: string,
  teamId: string
): Promise<Sprint | null> => {
  const sprint = await prisma.sprint.findFirst({
    where: { id: sprintId, teamId },
  });
  return sprint;
};

export const deleteSprint = async (sprintId: string): Promise<void> => {
  await prisma.sprint.delete({
    where: { id: sprintId },
  });
};

export type SprintWitHistory = Sprint & {
  sprintHistory: (SprintHistory & {
    sprintStatusHistory: SprintStatusHistory[];
  })[];
};

export const getSprintWithHistory = async (
  sprintId: string,
  teamId: string
): Promise<SprintWitHistory | null> => {
  const sprint = await prisma.sprint.findFirst({
    where: { teamId, id: sprintId },
    include: { sprintHistory: { include: { sprintStatusHistory: true } } },
  });
  return sprint;
};
