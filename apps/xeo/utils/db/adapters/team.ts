import { v4 } from 'uuid';
import { dynoMap, tableIdToPK } from '../db';
import { CreateTeam, Team, TeamDynamo, TeamEntity } from '../models/team';

const getTablePk = (id: string) => tableIdToPK(id, 'TEAM');

const mapDynamoTeamToTeam = (rawTeam: TeamDynamo): Team => {
  const notionConnection = rawTeam.notionAccessToken
    ? {
        notionAccessToken: rawTeam.notionAccessToken,
        notionBotId: rawTeam.notionBotId,
        notionWorkspaceId: rawTeam.notionWorkspaceId,
        notionWorkspaceIcon: rawTeam.notionWorkspaceIcon,
      }
    : null;

  return {
    entity: 'Team',
    id: rawTeam.id,
    name: rawTeam.name,
    shortName: rawTeam.shortName,
    companyName: rawTeam.companyName,
    notionConnection,
    modified: rawTeam.modified,
    created: rawTeam.created,
  };
};

const mapTeamToDynamo = (team: Partial<Team>): Partial<TeamDynamo> => {
  const notionConnection = team.notionConnection
    ? team.notionConnection
    : undefined;

  return {
    name: team.name,
    shortName: team.shortName,
    companyName: team.companyName,
    modified: team.modified,
    created: team.created,
    ...notionConnection,
  };
};

export const createTeam = async (
  input: CreateTeam
): Promise<Team | undefined> => {
  const id = v4();

  console.log(input);

  await TeamEntity.put({
    pk: getTablePk(id),
    sk: getTablePk(id),
    ...input,
  });

  return getTeam(id);
};

export const deleteTeam = async (id: Team['id']): Promise<boolean> => {
  await TeamEntity.delete({
    pk: getTablePk(id),
    sk: getTablePk(id),
  });

  return true;
};

export const getTeam = async (id: Team['id']): Promise<Team | undefined> => {
  const team = await dynoMap<TeamDynamo>(
    TeamEntity.get({ id: getTablePk(id), sk: getTablePk(id) })
  );

  return team ? mapDynamoTeamToTeam(team) : undefined;
};

export const updateTeam = async (id: Team['id'], input: Partial<Team>) => {
  await TeamEntity.update({
    pk: getTablePk(id),
    sk: getTablePk(id),
    ...mapTeamToDynamo(input),
  });

  return getTeam(id);
};
