import { BacklogMembers } from 'components/Backlog/BacklogMembers';
import { Content } from 'components/Content';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { TabLayout } from 'components/PageLayouts/TabLayout/TabLayout';
import { TeamSettings } from 'components/Team/TeamSettings/TeamSettings';
import { useCurrentTeam } from 'hooks/useCurrentTeam';

export function Index() {
  const { team } = useCurrentTeam();

  if (!team) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${team.name} (${team.shortName})`}
        subtitle="Add members, connect to Notion, and update your database properties"
      />
      <TabLayout
        tabs={[
          { label: 'Settings', content: <TeamSettings /> },
          {
            label: 'Members',
            content: (
              <Content>
                <BacklogMembers team={team} />
              </Content>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Index;
