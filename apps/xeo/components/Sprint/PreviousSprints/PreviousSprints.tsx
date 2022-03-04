import { Sprint } from '@prisma/client';
import { Table } from '@xeo/ui/lib/Table/Table';
import dayjs from 'dayjs';
import Link from 'next/link';

interface Props {
  sprints: Sprint[];
}

export const PreviousSprints: React.FunctionComponent<Props> = ({
  sprints,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <Table<Sprint>
        columns={[
          {
            Header: 'Name',
            accessor: 'name',
            Cell: (row) => (
              <Link href={`/sprint/${row.row.original.id}`}>{row.value}</Link>
            ),
          },
          {
            Header: 'Dates',
            accessor: (row) =>
              `${dayjs(row.startDate).format('DD/MM/YY')} - ${dayjs(
                row.endDate
              ).format('DD/MM/YY')}`,
          },
          // {
          //   Header: 'Success',
          //   accessor: 'plotData',
          //   Cell: (row) => {
          //     const stats = getSprintStats(row.value);

          //     if (!stats) {
          //       return <span>Unknown</span>;
          //     }

          //     const { deltaPoints } = stats;

          //     return (
          //       <span
          //         className={classNames(
          //           { 'text-red-400 dark:text-red-300': deltaPoints < 0 },
          //           { 'text-green-400 dark:text-green-300': deltaPoints >= 0 }
          //         )}
          //       >
          //         {roundToOneDecimal(deltaPoints)}{' '}
          //         {roundToOneDecimal(deltaPoints) < 0 ? 'Behind' : 'Ahead'}
          //       </span>
          //     );
          //   },
          // },
        ]}
        data={sprints}
      />
    </div>
  );
};
