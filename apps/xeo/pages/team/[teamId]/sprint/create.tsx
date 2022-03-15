import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Alert } from '@xeo/ui/lib/Alert/Alert';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Content } from 'components/Content';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { SprintCreate } from 'components/Sprint/SprintCreate/SprintCreate';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { NextSeo } from 'next-seo';
import { GetTeamNotionDatabase } from 'pages/api/team/[teamId]/database';
import { useQuery } from 'utils/api';

function Create() {
  const { team } = useCurrentTeam();

  const { data, error } = useQuery<GetTeamNotionDatabase>(
    `/api/team/${team?.id}/database`,
    !team
  );

  if (error) {
    return (
      <Content>
        <Alert variation="danger">
          Error loading Sprint, make sure you have a database connected...
        </Alert>
      </Content>
    );
  }

  if (!data) {
    return <CentredLoader />;
  }

  return (
    <div>
      <PageHeader
        title={`Create Sprint`}
        subtitle={`Add a new sprint to team ${team?.name}`}
        rightContent={
          <Button
            href={`/team/${team?.id}`}
            variation={ButtonVariation.Secondary}
          >
            Back
          </Button>
        }
        border
      />
      <Content className="my-10">
        <NextSeo
          title="Create Sprint"
          description="Create a new Sprint in Xeo"
        />
        <SprintCreate database={data.database} />
      </Content>
    </div>
  );
}

export default Create;
