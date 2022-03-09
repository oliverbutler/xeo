import { Entity } from 'dynamodb-toolbox';
import { BaseEntity, XeoTable } from '../db';

export type CreateTeam = Pick<Team, 'name' | 'shortName' | 'companyName'>;

export type UpdateTeam = Partial<
  Omit<Team, 'modified' | 'created' | 'entity' | 'id'>
>;

export type Team = {
  entity: 'Team';
  id: string;
  name: string;
  shortName: string;
  companyName: string;
  notionConnection: {
    notionAccessToken: string;
    notionBotId: string;
    notionWorkspaceId: string;
    notionWorkspaceIcon: string;
  } | null;
} & BaseEntity;

// Team as a DynamoDB entity
export type TeamDynamo = {
  id: string;
  name: string;
  shortName: string;
  companyName: string;
  notionAccessToken: string;
  notionBotId: string;
  notionWorkspaceId: string;
  notionWorkspaceIcon: string;
} & BaseEntity;

export const TeamEntity = new Entity({
  name: 'Team',
  table: XeoTable,

  attributes: {
    id: {
      partitionKey: true,
    },
    sk: {
      sortKey: true,
      hidden: true,
    },
    name: {
      type: 'string',
    },
    shortName: {
      type: 'string',
    },
    companyName: {
      type: 'string',
    },
    notionAccessToken: {
      type: 'string',
    },
    notionBotId: {
      type: 'string',
    },
    notionWorkspaceId: {
      type: 'string',
    },
    notionWorkspaceIcon: {
      type: 'string',
    },
  },
});
