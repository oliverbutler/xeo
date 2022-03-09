import { useCurrentUser } from 'hooks/useCurrentUser';
import { Onboarding } from './Onboarding/Onboarding';
import { SprintInfo } from './SprintInfo/SprintInfo';

export const IndexApp: React.FunctionComponent = () => {
  const { userMetadata, status } = useCurrentUser();

  if (status !== 'loading' && !userMetadata?.hasMetaData) {
    return <Onboarding />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="rounded-lg shadow-lg bg-white dark:bg-dark-800 col-span-2">
        <SprintInfo sprintData={null} sprintId="" publicMode={false} />
      </div>
      <div className="rounded-lg shadow-lg bg-white dark:bg-dark-800"></div>
    </div>
  );
};
