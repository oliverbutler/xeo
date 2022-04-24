import { TeamMembers } from 'components/Team/TeamMembers/TeamMembers';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { TabLayout } from 'components/PageLayouts/TabLayout/TabLayout';
import { TeamSettings } from 'components/Team/TeamSettings/TeamSettings';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { TeamMember } from '@prisma/client';
import { TeamSettingsMember } from 'components/Team/TeamSettings/TeamSettingsMember';
import { EpicSettings } from 'components/Epic/EpicSettings';

export function Index() {
  const { team } = useCurrentTeam();
  const { me } = useCurrentUser();

  const currentUserMember = team?.members.find(
    (member) => member.userId === me?.id
  );

  if (!team) {
    return <div>Loading</div>;
  }

  const isUserOnlyMember = currentUserMember?.role === 'MEMBER';

  return (
    <div>
      <PageHeader
        title={`Edit ${team.name} (${team.shortName})`}
        subtitle="Add members, connect to Notion, and update your database properties"
      />
      <TabLayout
        defaultIndex={isUserOnlyMember ? 1 : 0}
        tabs={[
          {
            label: 'Settings',
            content: isUserOnlyMember ? (
              <TeamSettingsMember />
            ) : (
              <TeamSettings />
            ),
          },
          {
            label: 'Notion',
            content: <EpicSettings />,
          },
          {
            label: 'Members',
            content: <TeamMembers team={team} />,
          },
        ]}
      />
    </div>
  );
}

export default Index;
