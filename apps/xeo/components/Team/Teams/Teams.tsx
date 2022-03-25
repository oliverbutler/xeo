import { Table } from '@xeo/ui/lib/Table/Table';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';
import { CreateTeamForm } from 'components/Team/CreateTeamForm';
import { NextSeo } from 'next-seo';
import { trackAction, UserAction } from 'utils/analytics';
import { TeamMember } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { Content } from 'components/Content';
import { CogIcon } from '@heroicons/react/outline';
import { TeamWithMemberAndBasicUserInfo } from 'utils/db/team/adapter';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { TeamAvatars } from './TeamAvatars';
import { CellProps } from 'react-table';

dayjs.extend(LocalizedFormat);

export const Teams: React.FunctionComponent = () => {
  const { me, availableTeams } = useCurrentUser();

  const getMyRoleInTeam = (
    team: TeamWithMemberAndBasicUserInfo
  ): TeamMember => {
    return team.members.find((member) => member.userId === me?.id)!;
  };

  return (
    <div>
      <PageHeader
        title={`View and manage Teams`}
        subtitle="View the current progress of your team"
        rightContent={
          <Modal
            mainText="Create Team"
            trigger={(setOpen) => (
              <Button
                onClick={() => {
                  trackAction(UserAction.CLICK_CREATE_TEAM);
                  setOpen();
                }}
                colour={ButtonColour.Dark}
              >
                Create a Team
              </Button>
            )}
            content={(setClose) => <CreateTeamForm closeModal={setClose} />}
          />
        }
        border
      />
      <NextSeo
        title={`Xeo Connections`}
        description={`View current Xeo Connections, and any backlogs shared with you`}
      />
      <Content>
        <h2>Your Teams</h2>
        <SettingsPanel>
          <Table<TeamWithMemberAndBasicUserInfo>
            columns={[
              { Header: 'Name', accessor: 'name' },
              {
                Header: 'Short Name',
                accessor: 'shortName',
              },
              {
                Header: 'Company',
                accessor: 'companyName',
              },
              {
                Header: 'My Role',
                accessor: (team) => getMyRoleInTeam(team).role,
              },
              {
                Header: 'Members',
                Cell: (
                  cell: React.PropsWithChildren<
                    CellProps<TeamWithMemberAndBasicUserInfo, unknown>
                  >
                ) => <TeamAvatars team={cell.row.original} />,
              },
            ]}
            data={availableTeams ?? []}
          />
        </SettingsPanel>
      </Content>
    </div>
  );
};
