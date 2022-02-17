import { Sprint } from '@prisma/client';

interface Props {
  sprint: Sprint;
}

export const SprintHistory: React.FunctionComponent<Props> = ({ sprint }) => {
  return (
    <div>
      <h2>History</h2>
    </div>
  );
};
