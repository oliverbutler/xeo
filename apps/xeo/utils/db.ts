/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { DynamoDB } from 'aws-sdk';
import { Entity, Table } from 'dynamodb-toolbox';
import { v4 } from 'uuid';

export const prisma: PrismaClient =
  (global as any).prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma;

export const client = new DynamoDB.DocumentClient({
  accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
  region: process.env.NEXT_AUTH_AWS_REGION,
  params: {
    TableName: process.env.NEXT_AUTH_AWS_TABLE,
  },
});

const XeoTable = new Table({
  // Specify table name (used by DynamoDB)
  name: 'xeo',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Add the DocumentClient
  DocumentClient: client,
});

export type Team = {
  entity: 'Team';
  id: string;
  name: string;
} & BaseEntity;

export type BaseEntity = {
  modified: string;
  created: string;
};

export const TeamEntity = new Entity({
  name: 'Team',
  table: XeoTable,

  // Define the entity's schema
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
  },
});
