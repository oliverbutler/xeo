import { Entity } from 'dynamodb-toolbox';
import { BaseEntity, XeoTable } from 'utils/db/db';

export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  FINANCIAL_SPONSOR = 'FINANCIAL_SPONSOR',
}

export type CreateUserMetadata = {
  email: string;
  preferredName: string;
};

export type UserMetadata = {
  entity: 'UserMetadata';
  role: UserRole;
  preferredName: string;
} & BaseEntity;

export const UserMetadataEntity = new Entity({
  name: 'UserMetadata',

  table: XeoTable,

  attributes: {
    id: {
      partitionKey: true,
    },
    sk: {
      sortKey: true,
      hidden: true,
    },
    role: {
      type: 'string',
    },
    preferredName: {
      type: 'string',
    },
  },
});
