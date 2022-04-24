import {
  DependencyGraph,
  NotionConnection,
  NotionDatabase,
  Sprint,
  SprintHistory,
  SprintStatusHistory,
  Team,
} from '@prisma/client';
import { prisma } from 'utils/db';
import {
  DeveloperWithCapacity,
  isDeveloperWithCapacityArray,
} from '../../sprint/utils';

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

export type SprintWithTeamAndConnectionAndDatabase = Sprint & {
  team: Team & {
    notionConnection: NotionConnection;
    notionDatabase: NotionDatabase;
  };
};

export const getSprintForTeamWithDatabaseAndConnection = async (
  sprintId: string,
  teamId: string
): Promise<SprintWithTeamAndConnectionAndDatabase | null> => {
  const sprint = await prisma.sprint.findFirst({
    where: { id: sprintId, teamId },
    include: {
      team: {
        include: {
          notionConnection: true,
          notionDatabase: true,
        },
      },
    },
  });

  if (
    !sprint ||
    !sprint.team ||
    !sprint.team.notionConnection ||
    !sprint.team.notionDatabase
  ) {
    return null;
  }

  return sprint as SprintWithTeamAndConnectionAndDatabase;
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

export const getSprintDependencies = async (
  sprintId: string
): Promise<DependencyPosition[] | null> => {
  const dependencies = await prisma.dependencyGraph.findUnique({
    where: { sprintId },
  });

  if (!dependencies) {
    return null;
  }

  return dependencies.ticketPositions as DependencyPosition[];
};

export const getEpicDependencies = async (
  epicId: string
): Promise<DependencyPosition[] | null> => {
  const epic = await prisma.notionEpic.findUnique({
    where: { id: epicId },
    include: {
      dependencyGraph: true,
    },
  });

  if (!epic?.dependencyGraph) {
    return null;
  }

  return epic.dependencyGraph.ticketPositions as DependencyPosition[];
};

export type DependencyPosition = {
  id: string;
  position: {
    x: number;
    y: number;
  };
};

export const updateSprintDependencies = async (
  sprintId: string,
  ticketPositions: DependencyPosition[]
) => {
  await prisma.sprint.update({
    where: {
      id: sprintId,
    },
    data: {
      dependencyGraph: {
        upsert: {
          create: {
            ticketPositions,
          },
          update: {
            ticketPositions,
          },
        },
      },
    },
  });
};

export const updateNotionEpicDependencies = async (
  epicId: string,
  ticketPositions: DependencyPosition[]
) => {
  await prisma.notionEpic.update({
    where: {
      id: epicId,
    },
    data: {
      dependencyGraph: {
        upsert: {
          update: {
            ticketPositions,
          },
          create: {
            ticketPositions,
          },
        },
      },
    },
  });
};
