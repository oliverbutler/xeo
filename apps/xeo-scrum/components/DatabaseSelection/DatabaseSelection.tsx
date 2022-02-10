import { GetNotionDatabasesResponse } from 'pages/api/notion/databases';
import useSWR from 'swr';
import { SelectStatusMapping } from './SelectStatusMapping';
import { SelectColumns } from './SelectColumns';
import { SelectDatabase } from './SelectDatabase';
import { useDatabaseSelection } from './useDatabaseSelection';
import { Button } from '@xeo/ui';

export const fetcher = (input: any, init: any) =>
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
    <div className="prose dark:prose-invert mt-10 flex max-w-none flex-col items-center justify-center">
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
