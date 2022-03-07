import { client, CreateTeam, Team, TeamEntity } from 'utils/db';
import { v4 } from 'uuid';

const tableName = process.env.NEXT_AUTH_AWS_TABLE as string;

const tableIdToPK = (id: string) => `TEAM#${id}`;
const tablePKToId = (pk: string) => pk.split('#').pop();

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

export const createTeam = async (
  input: CreateTeam
): Promise<Team | undefined> => {
  const id = v4();

  await TeamEntity.put({
    pk: tableIdToPK(id),
    sk: `info`,
    ...input,
  });

  return getTeam(id);
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
  const team = await dynoMap<Team>(
    TeamEntity.get({ id: tableIdToPK(id), sk: 'info' })
  );

  return team;
};

export const updateTeam = async (
  id: Team['id'],
  input: Partial<CreateTeam>
) => {
  await TeamEntity.update({
    pk: tableIdToPK(id),
    sk: `info`,
    ...input,
  });

  return getTeam(id);
};
