import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Content } from 'components/Content';
import { SprintCreate } from 'components/Sprint/SprintCreate/SprintCreate';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { NextSeo } from 'next-seo';

function Create() {
  const { team } = useCurrentTeam();

  return (
    <div className="min-h-screen">
      <Content className="my-10">
        <NextSeo
          title="Create Sprint"
          description="Create a new Sprint in Xeo"
        />
        <div className="flex flex-row justify-between">
          <div>
            <Button
              href={`/team/${team?.id}`}
              variation={ButtonVariation.Secondary}
            >
              Back
            </Button>
          </div>
        </div>

        <SprintCreate />
      </Content>
    </div>
  );
}

export default Create;
