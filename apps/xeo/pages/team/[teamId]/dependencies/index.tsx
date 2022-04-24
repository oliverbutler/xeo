import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Content } from 'components/Content';
import { DependencyGraph } from 'components/Dependencies/DependencyGraph';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { PutUpdateSprintDependencies } from 'pages/api/team/[teamId]/dependencies';
import { GetSprintDependencies } from 'pages/api/team/[teamId]/sprint/[sprintId]/dependencies';
import { GetSprintTickets } from 'pages/api/team/[teamId]/sprint/[sprintId]/tickets';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut, useQuery } from 'utils/api';

const dependencies: React.FunctionComponent = () => {
  const { currentTeamId, currentSprint } = useCurrentTeam();

  const shouldSkipAPICall = !currentSprint || !currentTeamId;

  const {
    data: tickets,
    error,
    isLoading,
  } = useQuery<GetSprintTickets>(
    `/api/team/${currentTeamId}/sprint/${currentSprint?.id}/tickets`,
    shouldSkipAPICall,
    { revalidateOnFocus: false } // this is a very expensive operation
  );

  const {
    data: dependencies,
    error: depError,
    isLoading: depIsLoading,
  } = useQuery<GetSprintDependencies>(
    `/api/team/${currentTeamId}/sprint/${currentSprint?.id}/dependencies`,
    shouldSkipAPICall
  );

  if (isLoading || depIsLoading) {
    return (
      <CentredLoader text="Hold on while we get your tickets from Notion!" />
    );
  }

  if (!currentSprint?.id || !currentTeamId) {
    return (
      <>
        <PageHeader title="Sprint Dependencies" />
        <Content className="mt-12">
          <SettingsPanel outline>
            <h3>You don't have an active sprint.</h3>
          </SettingsPanel>
        </Content>
      </>
    );
  }

  if (error || depError) {
    return (
      <>
        <PageHeader title="Sprint Dependencies" />
        <Content className="mt-12">
          <SettingsPanel outline>
            <h3>
              You're missing a "Parent" relation in your database config, speak
              to Xeo admin or owner!.
            </h3>
          </SettingsPanel>
        </Content>
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <DependencyGraph
        key={currentSprint.id}
        tickets={tickets.tickets}
        positions={dependencies.dependencies}
        refreshTicketsCallback={() => {
          mutate(
            `/api/team/${currentTeamId}/sprint/${currentSprint?.id}/tickets`
          );
        }}
        saveCallback={async ({ nodes }) => {
          const dependencies = nodes.map((node) => ({
            id: node.id,
            position: node.position,
          }));
          const { error } = await apiPut<PutUpdateSprintDependencies>(
            `/api/team/${currentTeamId}/dependencies`,
            { type: 'sprintId', id: currentSprint.id, dependencies }
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

export default dependencies;
