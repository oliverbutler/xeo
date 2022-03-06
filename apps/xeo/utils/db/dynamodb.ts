import { client } from 'utils/db';
import { v4 } from 'uuid';

export type Team = {
  id: string;
  teamName: string;
};

export type CreateTeam = {
  teamName: string;
};

const tableName = process.env.NEXT_AUTH_AWS_TABLE as string;

const tableIdToPK = (id: string) => `team#${id}`;
const tablePKToId = (pk: string) => pk.replace('team#', '');

export const createTeam = async (
  input: CreateTeam
): Promise<Team | undefined> => {
  const item = {
    pk: tableIdToPK(v4()),
    sk: `info`,
    ...input,
  };

  const result = await client
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  if (result.$response.error) {
    return undefined;
  }

  return {
    id: tablePKToId(item.pk),
    teamName: item.teamName,
  };
};

export const deleteTeam = async (id: Team['id']): Promise<boolean> => {
  const result = await client
    .delete({
      TableName: tableName,
      Key: {
        pk: tableIdToPK(id),
        sk: `info`,
      },
    })
    .promise();

  return !result.$response.error;
};

export const getTeam = async (id: Team['id']): Promise<Team | undefined> => {
  const result = await client
    .get({
      TableName: tableName,
      Key: {
        pk: tableIdToPK(id),
        sk: `info`,
      },
    })
    .promise();

  if (result.$response.error || !result.$response.data?.Item) {
    return undefined;
  }

  const responseData = result.$response.data?.Item as any;

  return {
    id: tablePKToId(responseData?.pk),
    teamName: responseData.teamName,
  };
};

export const getTeams = async (): Promise<Team[] | undefined> => {
  const result = await client
    .scan({
      TableName: tableName,
      FilterExpression: '#sk = :sk',
      ExpressionAttributeNames: {
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':sk': 'info',
      },
    })
    .promise();

  if (result.$response.error) {
    return undefined;
  }

  const responseData = result.$response.data?.Items as any;

  return responseData.map((item: any) => ({
    id: tablePKToId(item.pk),
    teamName: item.teamName,
  }));
};

export const updateTeam = async (
  id: Team['id'],
  input: Partial<CreateTeam>
) => {
  const result = await client
    .update({
      TableName: tableName,
      Key: {
        pk: tableIdToPK(id),
        sk: `info`,
      },
      UpdateExpression: `set teamName = :teamName`,
      ExpressionAttributeValues: {
        ':teamName': input.teamName,
      },
    })
    .promise();

  if (result.$response.error) {
    return undefined;
  }

  return await getTeam(id);
};
