import { GetNotionDatabasesResponse } from 'pages/api/notion/databases';
import useSWR from 'swr';
import Button from '../../../../libs/ui/src/lib/Button/Button';
import { SelectStatusMapping } from './SelectStatusMapping';
import { SelectColumns } from './SelectColumns';
import { SelectDatabase } from './SelectDatabase';
import { useDatabaseSelection } from './useDatabaseSelection';

export const fetcher = (input, init) =>
  fetch(input, init).then((res) => res.json());

export const DatabaseSelection: React.FunctionComponent = () => {
  const { data, error } = useSWR<GetNotionDatabasesResponse, string>(
    '/api/notion/databases',
    fetcher
  );

  const { onSubmit, form } = useDatabaseSelection();

  if (error) {
    return <div>Error Loading!</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10 prose dark:prose-invert max-w-none flex-col">
      <h1>Select Product Backlog</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <SelectDatabase form={form} databaseQueryData={data} error={error} />
        <SelectColumns form={form} />
        <SelectStatusMapping form={form} />
        <Button type="submit" className="mt-4 text-center">
          Add Database to Xeo
        </Button>
      </form>
    </div>
  );
};
