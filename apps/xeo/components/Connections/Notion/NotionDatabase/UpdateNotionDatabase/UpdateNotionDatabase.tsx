import { NotionConnection, NotionDatabase, Team } from '@prisma/client';
import { useQuery } from 'utils/api';
import { GetConnectionNotionDatabasesRequest } from 'pages/api/team/[teamId]/notion/databases';
import { UpdateNotionDatabaseForm } from './UpdateNotionDatabaseForm';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Alert } from '@xeo/ui/lib/Alert/Alert';
import { NotionDatabaseWithStatusLinks } from 'pages/api/team/[teamId]/notion';

export const fetcher = (input: any, init: any) =>
  fetch(input, init).then((res) => res.json());

interface NotionBacklogProps {
  team: Team;
  connection: NotionConnection;
  database: NotionDatabaseWithStatusLinks;
  closeModal: () => void;
}

export type DatabaseFromNotion = AvailableDatabasesFromNotion['databases'][0];

export const UpdateNotionDatabase: React.FunctionComponent<
  NotionBacklogProps
> = ({ team, connection, database, closeModal }) => {
  const { data, error } = useQuery<GetConnectionNotionDatabasesRequest>(
    `/api/team/${team.id}/notion/databases`
  );

  const currentDatabaseFromNotion = data?.notionResponse.databases.find(
    (db) => db.id === database.databaseId
  );

  if (!data) {
    return <CentredLoader />;
  }

  if (!currentDatabaseFromNotion) {
    return (
      <Alert variation="danger">
        Unable to get current database from Notion, was it deleted?
      </Alert>
    );
  }

  return (
    <UpdateNotionDatabaseForm
      database={database}
      closeModal={closeModal}
      connection={connection}
      databaseFromNotion={currentDatabaseFromNotion}
      team={team}
    />
  );
};
