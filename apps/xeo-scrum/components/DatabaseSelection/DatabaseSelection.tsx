import { SelectField } from '@xeo/ui';
import { GetNotionDatabasesResponse } from 'pages/api/notion/databases';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Button from '../../../../libs/ui/src/lib/Button/Button';

const fetcher = (input, init) => fetch(input, init).then((res) => res.json());

interface DatabaseSelectionForm {
  databaseId: string;
  storyPointsId: string | undefined;
  sprintId: string | undefined;
  selectId: string | undefined;
  ticketStatusId: string | undefined;
}

export const DatabaseSelection: React.FunctionComponent = () => {
  const { data, error } = useSWR<GetNotionDatabasesResponse, string>(
    '/api/notion/databases',
    fetcher
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<DatabaseSelectionForm>({});

  if (error) {
    return <div>Error Loading!</div>;
  }

  const databaseOptions =
    data?.databases?.map((database) => ({
      label: database.title,
      value: database.id,
      properties: database.properties,
    })) ?? [];

  const currentDatabaseSelected =
    databaseOptions.find((x) => x.value === watch('databaseId')) ?? undefined;

  const availableDatabaseProperties = currentDatabaseSelected
    ? Object.values(currentDatabaseSelected.properties)
    : [];

  const onSubmit = (data: DatabaseSelectionForm) => {
    toast('Database Selected!');
    console.log(data.databaseId);
  };

  return (
    <div className="flex justify-center items-center mt-10 prose dark:prose-invert max-w-none">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h1>Select DB</h1>

        <SelectField
          label="Database"
          control={control}
          name="databaseId"
          error={errors.databaseId}
          options={databaseOptions}
          rules={{ required: true }}
          loading={!data && !error}
        />

        {currentDatabaseSelected ? (
          <div>
            <h3>Select Columns</h3>
            <SelectField
              label="Story Points (number)"
              control={control}
              name="storyPointsId"
              error={errors.storyPointsId}
              options={availableDatabaseProperties
                .filter((properties) => properties.type === 'number')
                .map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              rules={{ required: true }}
            />
            <SelectField
              label="Status (select)"
              control={control}
              name="ticketStatusId"
              error={errors.ticketStatusId}
              options={availableDatabaseProperties
                .filter((properties) => properties.type === 'select')
                .map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              rules={{ required: true }}
            />
            <SelectField
              label="Sprint (select)"
              control={control}
              name="sprintId"
              error={errors.sprintId}
              options={availableDatabaseProperties
                .filter((properties) => properties.type === 'select')
                .map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
              rules={{ required: true }}
            />
          </div>
        ) : null}

        <Button type="submit" className="mt-4 text-center">
          Add Database to Xeo
        </Button>
      </form>
    </div>
  );
};
