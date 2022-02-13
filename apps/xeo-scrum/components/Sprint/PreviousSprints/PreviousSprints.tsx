import { Table } from '@xeo/ui';
import dayjs from 'dayjs';
import Link from 'next/link';
import { CompleteSprintWithoutPlotData } from 'utils/sprint/utils';

interface Props {
  sprints: CompleteSprintWithoutPlotData[];
}

export const PreviousSprints: React.FunctionComponent<Props> = ({
  sprints,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <Table<CompleteSprintWithoutPlotData>
        columns={[
          {
            Header: 'Name',
            accessor: 'sprint',
            Cell: (row) => (
              <Link href={`/sprint/${row.value.id}`}>{row.value.name}</Link>
            ),
          },
          {
            Header: 'Dates',
            accessor: (row) =>
              `${dayjs(row.sprint.startDate).format('DD/MM/YY')} - ${dayjs(
                row.sprint.endDate
              ).format('DD/MM/YY')}`,
          },
        ]}
        data={sprints}
      />
    </div>
  );
};
