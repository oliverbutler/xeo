import { v4 } from 'uuid';
import { dynoMap, tableIdToPK } from '../db';
import { CreateTeam, Team, TeamEntity } from '../models/team';

const TEAM_PREFIX = 'TEAM';

export const createTeam = async (
  input: CreateTeam
): Promise<Team | undefined> => {
  const id = v4();

  await TeamEntity.put({
    pk: tableIdToPK(id, TEAM_PREFIX),
    sk: `info`,
    ...input,
  });

  return getTeam(id);
};

export const deleteTeam = async (id: Team['id']): Promise<boolean> => {
  await TeamEntity.delete({
    pk: tableIdToPK(id, TEAM_PREFIX),
    sk: `info`,
  });

  return true;
};

export const getTeam = async (id: Team['id']): Promise<Team | undefined> => {
  const team = await dynoMap<Team>(
    TeamEntity.get({ id: tableIdToPK(id, TEAM_PREFIX), sk: 'info' })
  );

  return team;
};

export const updateTeam = async (
  id: Team['id'],
  input: Partial<CreateTeam>
) => {
  await TeamEntity.update({
    pk: tableIdToPK(id, TEAM_PREFIX),
    sk: `info`,
    ...input,
  });

  return getTeam(id);
};
