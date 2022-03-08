import { Entity } from 'dynamodb-toolbox';
import { BaseEntity, XeoTable } from '../db';

type DevelopersWithCapacityMap = {
  [userId: string]: number[];
};

export type CreateSprint = {
  startDate: string;
  endDate: string;
  notionSprintValue: string;
  sprintGoal: string;
  developers: DevelopersWithCapacityMap;
  teamSpeed: number;
  dailyStartTime: Time;
};

// HH:mm
type Time = string;

export type SprintHistoryMap = {
  [timestamp: string]: {
    [statusId: string]: {
      [ticketId: string]: number;
    };
  };
};

export type Sprint = {
  entity: 'Sprint';
  id: string;
  startDate: string;
  endDate: string;
  notionSprintValue: string;
  sprintGoal: string;
  teamSpeed: number;
  dailyStartTime: Time;
  developers: DevelopersWithCapacityMap;
  history: SprintHistoryMap;
} & BaseEntity;

// Sprint exists within a Team e.g.
// PK: TEAM#123
// SK: SPRINT#456
// This lets you quickly query for all sprints for a team <- #1 Access Pattern

export const SprintEntity = new Entity({
  name: 'Sprint',
  table: XeoTable,

  attributes: {
    id: {
      partitionKey: true,
    },
    sk: {
      sortKey: true,
    },
    startDate: {
      type: 'string',
      required: true,
    },
    endDate: {
      type: 'string',
      required: true,
    },
    notionSprintValue: {
      type: 'string',
      required: true,
    },
    sprintGoal: {
      type: 'string',
      required: true,
    },

    teamSpeed: {
      type: 'number',
      required: true,
    },
    dailyStartTime: {
      type: 'string',
      required: true,
    },
    developers: {
      type: 'map',
      required: true,
    },
    history: {
      type: 'map',
      required: true,
    },
  },
});
