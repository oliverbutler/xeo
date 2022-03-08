import { v4 } from 'uuid';
import { dynoMap, tableIdToPK } from '../db';
import { CreateSprint, Sprint, SprintEntity } from '../models/sprint';

const TEAM_KEY = 'TEAM';
const SPRINT_KEY = 'SPRINT';

export const getSprintFromTeam = async (
  sprintId: string,
  teamId: string
): Promise<Sprint | undefined> => {
  const result = await dynoMap<Sprint>(
    SprintEntity.get({
      pk: tableIdToPK(teamId, TEAM_KEY),
      sk: tableIdToPK(sprintId, SPRINT_KEY),
    })
  );

  return result;
};

export const createSprint = async (
  teamId: string,
  input: CreateSprint
): Promise<Sprint | undefined> => {
  const sprintId = v4();

  await SprintEntity.put({
    pk: tableIdToPK(sprintId, SPRINT_KEY),
    sk: tableIdToPK(teamId, TEAM_KEY),
    ...input,
  });

  return getSprintFromTeam(sprintId, teamId);
};
