import { Sprint, Team, TeamMember, TeamRole } from '@prisma/client';
import { prisma } from 'utils/db';

export type CreateTeam = {
  name: string;
  shortName: string;
  companyName: string;
};

export const createTeam = async (
  userId: string,
  input: CreateTeam
): Promise<Team> => {
  console.log(userId, input);
  const team = await prisma.team.create({
    data: {
      name: input.name,
      shortName: input.shortName,
      companyName: input.companyName,
      members: {
        create: {
          userId: userId,
          role: 'OWNER',
        },
      },
    },
  });

  return team;
};

export const updateTeam = async (
  teamId: string,
  input: Partial<CreateTeam>
): Promise<Team> => {
  const team = await prisma.team.update({
    where: { id: teamId },
    data: {
      name: input.name,
      shortName: input.shortName,
      companyName: input.companyName,
    },
  });

  return team;
};

export const getTeam = async (teamId: string): Promise<Team | null> => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  return team;
};

export type TeamWithSprintsAndMembers = Team & {
  sprints: Sprint[];
  members: (TeamMember & {
    user: {
      image: string | null;
      name: string | null;
      email: string | null;
    };
  })[];
};

export const getUserRoleInTeam = async (
  userId: string,
  teamId: string
): Promise<TeamRole | null> => {
  const teamMember = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });
  return teamMember?.role ?? null;
};

export const getTeamWithSprintsAndMembers = async (
  teamId: string
): Promise<TeamWithSprintsAndMembers | null> => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      sprints: true,
      members: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return team;
};

export const addMemberToTeam = async (
  teamId: string,
  userId: string
): Promise<TeamMember> => {
  const member = await prisma.teamMember.create({
    data: {
      teamId: teamId,
      userId: userId,
      role: 'MEMBER',
    },
  });

  return member;
};

export const updateTeamMember = async (
  teamId: string,
  userId: string,
  input: {
    role: 'ADMIN' | 'MEMBER';
  }
) => {
  const member = await prisma.teamMember.update({
    where: {
      userId_teamId: {
        userId: userId,
        teamId: teamId,
      },
    },
    data: {
      role: input.role,
    },
  });

  return member;
};

export type TeamWithMemberAndBasicUserInfo = Team & {
  members: (TeamMember & {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  })[];
};

export const getTeamsForUser = async (
  userId: string
): Promise<TeamWithMemberAndBasicUserInfo[]> => {
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return teams;
};

export const deleteTeam = async (teamId: string): Promise<Team> => {
  const team = await prisma.team.delete({
    where: { id: teamId },
  });

  return team;
};
