import { Table } from '@xeo/ui/lib/Table/Table';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { CreateTeamForm } from 'components/Team/CreateTeamForm';
import { NextSeo } from 'next-seo';
import { trackAction, UserAction } from 'utils/analytics';
import { useQuery } from 'utils/api';
import { GetTeamsForUserRequest } from './api/team';
import { Team } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { PageHeader } from 'components/PageHeader/PageHeader';

dayjs.extend(LocalizedFormat);

export function Teams() {
  const { data } = useQuery<GetTeamsForUserRequest>('/api/team');

  const teams = data?.teams ?? [];

  return (
    <div>
      <PageHeader
        title={`View and manage Teams`}
        subtitle="View the current progress of your team"
        border
      />
      <NextSeo
        title={`Xeo Connections`}
        description={`View current Xeo Connections, and any backlogs shared with you`}
      />
      <Modal
        mainText="Create Team"
        trigger={(setOpen) => (
          <Button
            onClick={() => {
              trackAction(UserAction.CLICK_CREATE_TEAM);
              setOpen();
            }}
            variation={ButtonVariation.Primary}
          >
            Create a Team
          </Button>
        )}
        content={(setClose) => <CreateTeamForm closeModal={setClose} />}
      />
      <div className="mt-6">
        <Table<Team>
          columns={[
            { Header: 'Name', accessor: 'name' },
            {
              Header: 'Connected',
              accessor: 'createdAt',
              Cell: (cell) => dayjs(cell.value).format('LLL'),
            },
            // {
            //   Header: 'Actions',
            //   accessor: 'id',
            //   Cell: (cell) => (
            //     <div>
            //       <Link
            //         href={`/connections/backlog/notion/${cell.value}`}
            //         passHref
            //       >
            //         <Clickable>
            //           <PencilIcon height={25} width={25} />
            //         </Clickable>
            //       </Link>
            //     </div>
            //   ),
            // },
          ]}
          data={teams}
        />
      </div>
    </div>
  );
}

export default Teams;
