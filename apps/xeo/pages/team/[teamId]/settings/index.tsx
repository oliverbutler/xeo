import { TeamMembers } from 'components/Team/TeamMembers/TeamMembers';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { TabLayout } from 'components/PageLayouts/TabLayout/TabLayout';
import { TeamSettings } from 'components/Team/TeamSettings/TeamSettings';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { TeamNotionSettings } from 'components/Team/TeamSettings/TeamNotionSettings';
import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';

export function Index() {
  const { team } = useCurrentTeam();
  const { me } = useCurrentUser();

  const currentUserMember = team?.members.find(
    (member) => member.userId === me?.id
  );

  if (!team) {
    return <CentredLoader />;
  }

  const isUserOnlyMember = currentUserMember?.role === 'MEMBER';

  return (
    <div>
      <PageHeader
        title={`Edit ${team.name} (${team.shortName})`}
        subtitle="Add members, connect to Notion, and update your database properties"
      />
      <TabLayout
        defaultIndex={isUserOnlyMember ? 2 : 0}
        tabs={[
          {
            label: 'Settings',
            isDisabled: isUserOnlyMember,
            content: <TeamSettings />,
          },
          {
            label: 'Notion',
            isDisabled: isUserOnlyMember,
            content: <TeamNotionSettings />,
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
