import { Button } from 'components/Button/Button';
import { PageChildren_Database_Fragment } from 'generated';

interface Props {
  database: PageChildren_Database_Fragment;
}

export const DatabaseBlock: React.FunctionComponent<Props> = ({ database }) => {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <p className="text-xl font-bold">{database.properties.title.rawText}</p>
        <Button>New</Button>
      </div>
    </div>
  );
};
