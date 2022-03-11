import { Button } from '@xeo/ui/lib/Button/Button';
import { Input } from '@xeo/ui/lib/Input/Input';
import { Content } from 'components/Content';
import { useCurrentTeam } from 'hooks/useCurrentTeam';

interface Props {}

export const TeamSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();

  return (
    <Content>
      <div className="space-y-4 bg-dark-950 p-4 mt-4 rounded-md">
        <Input label="Name" value={team?.name} />
        <Input label="Short Name" value={team?.shortName} />
        <Input label="Company" value={team?.companyName} />
        <Button>Save</Button>
      </div>
    </Content>
  );
};
