import { Sprint } from '@prisma/client';
import { prisma } from 'utils/db';
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
  userId: string,
  backlogId: string,
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
      backlog: {
        connect: {
          id: backlogId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return sprint;
};
