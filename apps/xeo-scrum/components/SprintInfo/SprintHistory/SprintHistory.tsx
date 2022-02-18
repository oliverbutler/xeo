import { Sprint } from '@prisma/client';
import { Error } from 'components/Error/Error';
import {
  GetSprintHistory,
  SprintHistoryWithStatus,
} from 'pages/api/sprint/[sprintId]/history';
import { useQuery } from 'utils/api';
import { CentredLoader, Table } from '@xeo/ui';
import dayjs from 'dayjs';
import { groupBy } from '@xeo/utils';

interface Props {
  sprint: Sprint;
}

export const SprintHistory: React.FunctionComponent<Props> = ({ sprint }) => {
  const { data, error, isLoading } = useQuery<GetSprintHistory>(
    `/api/sprint/${sprint.id}/history`
  );

  if (isLoading) {
    return <CentredLoader />;
  }

  if (error || !data) {
    return (
      <Error errorMessage="Error fetching sprint history, please try again!" />
    );
  }

  const historyByDay = groupBy(data.sprintHistory, (item) =>
    dayjs(item.timestamp).format('YYYY-MM-DD')
  );

  console.log(historyByDay);

  return (
    <div>
      <h2>History</h2>
      <Table<SprintHistoryWithStatus>
        columns={[
          {
            Header: 'Time',
            accessor: 'timestamp',
            Cell: (row) => dayjs(row.value).format('DD/MM/YY HH:mm'),
          },
        ]}
        data={data.sprintHistory}
      />
    </div>
  );
};
