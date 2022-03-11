import { Sprints } from 'components/Sprint/Sprint';
import { useCurrentTeam } from 'hooks/useCurrentTeam';

export function Index() {
  const { team } = useCurrentTeam();

  if (!team) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Sprints sprints={team.sprints} />
    </div>
  );
}

export default Index;
