import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { BacklogWithNotionStatusLinksAndOwner } from 'pages/api/backlog';
import { useBacklog } from './useBacklog';
import Image from 'next/image';
import { CellProps } from 'react-table';
import { BacklogRole } from '@prisma/client';
import { Table } from '@xeo/ui/lib/Table/Table';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';

interface Props {
  backlogs: BacklogWithNotionStatusLinksAndOwner[] | undefined;
}

export const BacklogTable: React.FunctionComponent<Props> = ({ backlogs }) => {
  const { data } = useSession();
  const userId = data?.id;

  const { leaveBacklog } = useBacklog();

  const getCurrentRoleInBacklog = (
    backlog: BacklogWithNotionStatusLinksAndOwner
  ) => backlog.members.find((member) => member.user.id === userId)?.role;

  return (
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
          Header: 'Role',
          accessor: 'id',
          Cell: (cell) => (
            <span>{getCurrentRoleInBacklog(cell.row.original)}</span>
          ),
        },
        {
          Header: 'Actions',
          Cell: (
            cell: React.PropsWithChildren<
              CellProps<BacklogWithNotionStatusLinksAndOwner, unknown>
            >
          ) => (
            <div className="flex flex-row gap-2">
              <Button
                href={`/connections/backlog/notion/${cell.row.original.id}`}
                variation={ButtonVariation.Secondary}
                disabled={
                  getCurrentRoleInBacklog(cell.row.original) !==
                  BacklogRole.ADMIN
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => leaveBacklog(cell.row.original.id)}
                variation={ButtonVariation.Danger}
              >
                Leave
              </Button>
            </div>
          ),
        },
      ]}
      data={
        backlogs?.filter(
          (backlog) => backlog.notionConnection?.createdByUser.id !== userId
        ) ?? []
      }
    />
  );
};
