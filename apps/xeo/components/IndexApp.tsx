import { Sprint } from './Sprint/Sprint';
import { SprintInfo } from './SprintInfo/SprintInfo';

export const IndexApp: React.FunctionComponent = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="rounded-lg shadow-lg bg-white col-span-2">
        <SprintInfo sprintData={null} sprintId="" publicMode={false} />
      </div>
      <div className="rounded-lg shadow-lg bg-white"></div>
    </div>
  );
};
