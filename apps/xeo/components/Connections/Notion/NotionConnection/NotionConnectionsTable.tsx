import { PencilIcon } from '@heroicons/react/outline';
import { Backlog } from '@prisma/client';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { Table } from '@xeo/ui/lib/Table/Table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Connection } from 'pages/api/connections';
import Skeleton from 'react-loading-skeleton';
import { NotionBacklog } from '../NotionBacklog/NotionBacklog';
import { DeleteNotionConnection } from './DeleteNotionConnection';
import { NotionLogoRenderer } from './NotionLogoRenderer';

interface Props {
  connections: Connection[] | undefined;
}

export const NotionConnectionsTable: React.FunctionComponent<Props> = ({
  connections,
}) => {
  return (
    <div>
      <div className="mt-10 ">
        {(connections ?? [{ connection: null, backlogs: [] }]).map(
          ({ connection, backlogs }, index) => (
            <div
              key={connection?.id ?? index}
              className=" bg-white dark:bg-dark-950 mb-10 p-4 shadow-md rounded-md  transition-all hover:shadow-md"
            >
              <div className="flex w-full flex-row items-center">
                <div className="flex flex-row gap-4">
                  <NotionLogoRenderer
                    iconString={connection?.notionWorkspaceIcon}
                  />
                  <div>
                    <h3 className="my-0 mr-4">
                      {connection ? (
                        `${connection.notionWorkspaceName ?? ''}`
                      ) : (
                        <Skeleton width={200} />
                      )}
                    </h3>
                    <div className="my-2">
                      <div>
                        <b>Connected:</b>{' '}
                        {connection ? (
                          dayjs(connection.createdAt).format('LLL')
                        ) : (
                          <Skeleton width={80} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {connection ? (
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
                ) : null}
              </div>
              <div>
                <Table<Backlog>
                  columns={[
                    { Header: 'Name', accessor: 'databaseName' },
                    {
                      Header: 'Connected',
                      accessor: 'createdAt',
                      Cell: (cell) => dayjs(cell.value).format('LLL'),
                    },
                    {
                      Header: 'Actions',
                      accessor: 'id',
                      Cell: (cell) => (
                        <div>
                          <Link
                            href={`/connections/backlog/notion/${cell.value}`}
                            passHref
                          >
                            <Clickable>
                              <PencilIcon height={25} width={25} />
                            </Clickable>
                          </Link>
                        </div>
                      ),
                    },
                  ]}
                  data={backlogs}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
