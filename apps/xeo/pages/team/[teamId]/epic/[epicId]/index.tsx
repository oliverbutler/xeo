import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Content } from 'components/Content';
import { DependencyGraph } from 'components/Dependencies/DependencyGraph';
import { Error } from 'components/Error/Error';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useRouter } from 'next/router';
import { PutUpdateSprintDependencies as PutUpdateDependencies } from 'pages/api/team/[teamId]/dependencies';
import { GetNotionEpicDependencies } from 'pages/api/team/[teamId]/epic/[epicId]/dependencies';
import { GetNotionEpicTickets } from 'pages/api/team/[teamId]/epic/[epicId]/tickets';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut, useQuery } from 'utils/api';

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

  const {
    data: dependencies,
    error: depError,
    isLoading: depIsLoading,
  } = useQuery<GetNotionEpicDependencies>(
    `/api/team/${currentTeamId}/epic/${epicId}/dependencies`,
    shouldSkipAPICall
  );

  if (isLoading || depIsLoading || !epicId || typeof epicId !== 'string') {
    return (
      <CentredLoader text="Hold on while we get your tickets from Notion!" />
    );
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
      <DependencyGraph
        key={epicId}
        tickets={tickets?.tickets ?? []}
        positions={dependencies?.dependencies ?? []}
        refreshTicketsCallback={() => {
          mutate(`/api/team/${currentTeamId}/epic/${epicId}/tickets`);
        }}
        saveCallback={async ({ nodes }) => {
          const dependencies = nodes.map((node) => ({
            id: node.id,
            position: node.position,
          }));
          const { error } = await apiPut<PutUpdateDependencies>(
            `/api/team/${currentTeamId}/dependencies`,
            { type: 'epicId', id: epicId, dependencies }
          );

          if (error) {
            toast.error(error.body?.message ?? error.generic);
            return;
          }
        }}
      />
    </div>
  );
};

export default index;
