import { Entity } from 'dynamodb-toolbox';
import { BaseEntity, XeoTable } from '../db';

export type CreateTeam = {
  name: string;
  notionAccessToken: string;
  notionBotId: string;
  notionWorkspaceId: string;
  notionWorkspaceIcon: string;
};

export type Team = {
  entity: 'Team';
  id: string;
  name: string;
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
