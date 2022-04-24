import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Content } from 'components/Content';
import { DependencyGraph } from 'components/Dependencies/DependencyGraph';
import { Error } from 'components/Error/Error';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useRouter } from 'next/router';
import { GetNotionEpicTickets } from 'pages/api/team/[teamId]/epic/[epicId]/tickets';
import { useQuery } from 'utils/api';

interface Props {}

export const index: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { epicId } = router.query;
  const { team, currentTeamId } = useCurrentTeam();

  const shouldSkipAPICall = !currentTeamId || !epicId;

  const {
    data: tickets,
    error,
    isLoading,
  } = useQuery<GetNotionEpicTickets>(
    `/api/team/${currentTeamId}/epic/${epicId}/tickets`,
    shouldSkipAPICall,
    { revalidateOnFocus: false } // this is a very expensive operation
  );

  if (!epicId || typeof epicId !== 'string') {
    return <div>No sprint id</div>;
  }

  const epic = team?.notionDatabase?.notionEpics.find(
    (epic) => epic.id === epicId
  );

  if (!epic) {
    return (
      <>
        <PageHeader title="Sprint Dependencies" />
        <Content className="mt-12">
          <Error errorMessage="Can't find this Epic, add it in Settings > Notion > Epics" />
        </Content>
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <DependencyGraph tickets={tickets?.tickets ?? []} positions={[]} />
    </div>
  );
};

export default index;
