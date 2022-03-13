import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import { Content } from 'components/Content';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { GetTeamNotionConnectionInformation } from 'pages/api/team/[teamId]/notion';
import { useQuery } from 'utils/api';
import { NotionSettings } from './NotionSettings';

interface Props {}

const ConnectToNotionButton = () => {
  const { team } = useCurrentTeam();
  const { data } = useQuery<GetNotionAuthURL>(
    `/api/connections/notion/auth-url?teamId=${team?.id}`
  );
  return <Button href={data?.url}>Connect to Notion</Button>;
};

export const TeamSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();

  const { data, error } = useQuery<GetTeamNotionConnectionInformation>(
    `/api/team/${team?.id}/notion`,
    !team
  );

  if (!team) {
    return <CentredLoader />;
  }

  return (
    <Content>
      <h2>General</h2>
      <p>General team settings</p>
      <div className="space-y-4 bg-dark-950 p-4 mt-4 rounded-md">
        <Input label="Name" value={team.name} />
        <Input label="Short Name" value={team.shortName} />
        <Input label="Company" value={team.companyName} />
        <Button>Save</Button>
      </div>

      <h2>Notion</h2>
      <p>Here you can configure the current connection to Notion</p>

      {data?.notionConnection ? (
        <div className="space-y-4 bg-dark-950 p-4 mt-4 rounded-md">
          <NotionSettings connection={data.notionConnection} team={team} />
        </div>
      ) : (
        <div className="rounded-lg outline-dashed outline-8 col-span-3 flex items-center justify-center outline-dark-600/20 m-2 py-12 flex-col">
          No Notion Connection
          <ConnectToNotionButton />
        </div>
      )}
    </Content>
  );
};
