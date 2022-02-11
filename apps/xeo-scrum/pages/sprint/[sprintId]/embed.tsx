import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { useRouter } from 'next/router';

const SprintComponent: React.FunctionComponent = () => {
  const router = useRouter();
  const { sprintId } = router.query;

  if (!sprintId || typeof sprintId !== 'string') {
    return <div>No sprint id</div>;
  }

  return <SprintInfo sprintId={sprintId as string} publicMode={true} />;
};

export default SprintComponent;
