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

  if (!data || error) {
    return <div>Loading...</div>;
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
