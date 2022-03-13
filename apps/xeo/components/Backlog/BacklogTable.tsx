import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { BacklogWithNotionStatusLinksAndOwner } from 'pages/api/backlog_deprecated';
import { useBacklog } from './useBacklog';
import Image from 'next/image';
import { CellProps } from 'react-table';
import { BacklogRole } from '@prisma/client';
import { Table } from '@xeo/ui/lib/Table/Table';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import Link from 'next/link';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import { ConditionalWrapper } from '@xeo/ui/lib/ConditionalWrapper/ConditionalWrapper';
import { LogoutIcon } from '@heroicons/react/outline';
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
              <div>
                <Link
                  href={`/connections/backlog/notion/${cell.row.original.id}`}
                  passHref
                >
                  <Clickable>
                    <PencilIcon height={25} width={25} />
                  </Clickable>
                </Link>
              </div>
              <Clickable onClick={() => leaveBacklog(cell.row.original.id)}>
                <LogoutIcon height={25} width={25} />
              </Clickable>
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
