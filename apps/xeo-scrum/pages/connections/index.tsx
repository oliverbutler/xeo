import { CentredLoader, Table, Clickable, Alert } from '@xeo/ui';
import { Connections } from 'components/Connections/Connections';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import dayjs from 'dayjs';
import {
  BacklogWithNotionStatusLinksAndOwner,
  GetBacklogsRequest,
} from 'pages/api/backlog';
import {
  BacklogWithMembersRestricted,
  GetConnectionsRequest,
} from 'pages/api/connections';
import useSWR from 'swr';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { LogoutIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline';
import { SecretText } from 'components/SecretText/SecretText';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

dayjs.extend(LocalizedFormat);

export function Index() {
  const { data: dataBacklogs, error: errorBacklogs } = useSWR<
    GetBacklogsRequest['responseBody'],
    string
  >('/api/backlog', fetcher);

  const { data: dataConnections, error: errorConnections } = useSWR<
    GetConnectionsRequest['responseBody'],
    string
  >('/api/connections', fetcher);

  const session = useSession();

  const userId = session?.data?.id as string | undefined;

  return (
    <div className="p-10">
      <h1>Connections</h1>
      <Alert variation="info">
        If you are a developer, please contact your admin to invite you to the
        Backlog, alternatively you can create a new Connection and invite your
        team.
      </Alert>

      <h2>Add New Connections</h2>
      <Connections />
      <h2>My Connections</h2>
      {!dataConnections && !errorConnections ? (
        <CentredLoader />
      ) : errorConnections || !dataConnections ? (
        <div>Error Loading Connections</div>
      ) : (
        <>
          {dataConnections.connections.length === 0 ? (
            <p>
              No Connections, please create one or contact your admin to invite
              you.
            </p>
          ) : null}
          <div className=":border-l-dark-100 dark:border-l-dark-800 mt-10 border-l-4 pl-6">
            {dataConnections.connections.map(({ connection, backlogs }) => (
              <div key={connection.id} className="">
                <div className="flex flex-row items-center">
                  <div className="text-dark-900 rounded-lg bg-white px-2 font-bold">
                    Notion
                  </div>
                  <h2 className="mx-4 my-0">{connection.connectionName}</h2>
                  <p className="mb-0">
                    Connected {dayjs(connection.createdAt).format('LLL')}
                  </p>
                </div>
                <SecretText text={connection.secretKey} />
                <div>
                  <Table<BacklogWithMembersRestricted>
                    columns={[
                      { Header: 'Name', accessor: 'databaseName' },
                      {
                        Header: 'Connected',
                        accessor: 'createdAt',
                        Cell: (cell) => dayjs(cell.value).format('LLL'),
                      },
                      {
                        Header: 'Users',
                        accessor: 'members',
                        Cell: (cell) => (
                          <div className="flex flex-row">
                            {cell.value.map((member) => {
                              return member.user.image ? (
                                <Image
                                  className="rounded-full"
                                  key={member.userId}
                                  src={member.user.image}
                                  height={30}
                                  width={30}
                                  alt={member.user?.name ?? ''}
                                />
                              ) : null;
                            })}
                          </div>
                        ),
                      },
                      {
                        Header: 'Actions',
                        Cell: () => (
                          <div className="flex flex-row ">
                            <Clickable>
                              <ShareIcon width={25} height={25} />
                            </Clickable>
                            <Clickable>
                              <TrashIcon width={25} height={25} />
                            </Clickable>
                          </div>
                        ),
                      },
                    ]}
                    data={backlogs}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <h2>Backlogs Shared With Me</h2>
      {!dataBacklogs && !errorBacklogs ? (
        <CentredLoader />
      ) : errorBacklogs || !dataBacklogs ? (
        <div>Error Loading Backlogs</div>
      ) : (
        <Table<BacklogWithNotionStatusLinksAndOwner>
          columns={[
            { Header: 'Name', accessor: 'databaseName' },
            {
              Header: 'Connected',
              accessor: 'createdAt',
              Cell: (cell) => dayjs(cell.value).format('LLL'),
            },
            {
              Header: 'Owner',
              accessor: 'notionConnection',
              Cell: (cell) => (
                <div className="flex flex-row">
                  {cell.value?.createdByUser?.image ? (
                    <Image
                      className="rounded-full"
                      src={cell.value.createdByUser.image}
                      height={30}
                      width={30}
                      alt={cell.value.createdByUser?.name ?? ''}
                    />
                  ) : (
                    <p>{cell.value?.createdByUser?.name ?? ''}</p>
                  )}
                </div>
              ),
            },
            {
              Header: 'Actions',
              Cell: () => (
                <div className="flex flex-row">
                  <Clickable>
                    <LogoutIcon width={25} height={25} />
                  </Clickable>
                </div>
              ),
            },
          ]}
          data={dataBacklogs.backlogs.filter(
            (backlog) => backlog.notionConnection?.createdByUser.id !== userId
          )}
        />
      )}
    </div>
  );
}

export default Index;
