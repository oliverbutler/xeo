import {
  Loader,
  Table,
  Clickable,
  Modal,
  Button,
  ButtonVariation,
} from '@xeo/ui';
import { Connections } from 'components/Connections/Connections';
import {
  NotionBacklog,
  fetcher,
} from 'components/Connections/Notion/NotionBacklog/NotionBacklog';
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
import { LogoutIcon, ShareIcon } from '@heroicons/react/outline';
import { SecretText } from 'components/SecretText/SecretText';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { DeleteNotionConnection } from 'components/Connections/Notion/NotionConnection/DeleteNotionConnection';
import { DeleteNotionBacklog } from 'components/Connections/Notion/NotionBacklog/DeleteNotionBacklog';
import { ShareBacklog } from 'components/Backlog/ShareBacklog/ShareBacklog';

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

      {!dataConnections && !errorConnections ? (
        <Loader />
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
          <div className="mt-10 ">
            {dataConnections.connections.map(({ connection, backlogs }) => (
              <div
                key={connection.id}
                className="outline-dark-200 mb-10 rounded-md p-4 outline-dotted"
              >
                <div className="flex w-full flex-row items-center">
                  <div>
                    <h3 className="my-0 mr-4">{connection.connectionName}</h3>
                    <div className="my-2">
                      <div>
                        <b>Connected:</b>{' '}
                        {dayjs(connection.createdAt).format('LLL')}
                      </div>
                      <div>
                        <b>Secret:</b>{' '}
                        <SecretText text={connection.secretKey} />
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-row gap-2">
                    <Modal
                      mainText="Add Backlog"
                      trigger={(setOpen) => (
                        <Button
                          onClick={setOpen}
                          variation={ButtonVariation.Secondary}
                        >
                          Add Backlog
                        </Button>
                      )}
                      content={(setClose) => (
                        <NotionBacklog
                          notionConnectionId={connection.id}
                          closeModal={setClose}
                        />
                      )}
                    />
                    <DeleteNotionConnection connection={connection} />
                  </div>
                </div>
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
                        accessor: 'id',
                        Cell: (cell) => (
                          <div className="flex flex-row ">
                            <ShareBacklog backlog={cell.row.original} />
                            <DeleteNotionBacklog backlogId={cell.value} />
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
        <Loader />
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
      <h2>Add New Connections</h2>
      <Connections />
    </div>
  );
}

export default Index;
