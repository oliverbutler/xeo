import { PageChildren_Database_Fragment } from 'generated';

interface Props {
  database: PageChildren_Database_Fragment;
}

export const DatabaseBlock: React.FunctionComponent<Props> = ({ database }) => {
  return (
    <div>
      <p>{database.id}</p>
    </div>
  );
};
