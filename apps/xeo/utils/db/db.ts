/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { DynamoDB } from 'aws-sdk';
import { Table } from 'dynamodb-toolbox';

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

export const XeoTable = new Table({
  name: 'xeo',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient: client,
});

export type BaseEntity = {
  modified: string;
  created: string;
};

export const tableIdToPK = (id: string, prefix: string) => `${prefix}#${id}`;
export const tablePKToId = (pk: string) => pk.split('#').pop();

export const dynoMap = async <T>(
  item: Promise<any>
): Promise<T | undefined> => {
  const result = await item;

  if (!result.Item) {
    return undefined;
  } else {
    return {
      ...result.Item,
      id: tablePKToId(result.Item.id), // map table
    };
  }
};
