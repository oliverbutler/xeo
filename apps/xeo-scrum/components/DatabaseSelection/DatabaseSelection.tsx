import { SelectField } from '@xeo/ui';
import { GetNotionDatabasesResponse } from 'pages/api/notion/databases';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Button from '../../../../libs/ui/src/lib/Button/Button';
import axios from 'axios';
import {
  PostCreateBacklogBody,
  PostCreateBacklogResponse,
} from 'pages/api/backlog/create';

export const fetcher = (input, init) =>
  fetch(input, init).then((res) => res.json());

interface DatabaseSelectionForm {
  databaseId: string;
  storyPointsId: string | undefined;
  sprintId: string | undefined;
  selectId: string | undefined;
  ticketStatusId: string | undefined;
  statusMapping: {
    statusDoneId: string | undefined;
    statusToValidateId: string | undefined;
    statusInProgressId: string | undefined;
    statusToDoId: string | undefined;
  };
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

  const onSubmit = async (formData: DatabaseSelectionForm) => {
    const body: PostCreateBacklogBody = {
      notionDatabaseId: formData.databaseId,
      notionDatabaseName: currentDatabaseSelected?.label,
      statusColumnId: formData.ticketStatusId,
      pointsColumnId: formData.storyPointsId,
      sprintColumnId: formData.sprintId,
    };

    const { data, status } = await axios.post<PostCreateBacklogResponse>(
      '/api/backlog/create',
      body
    );

    if (status !== 200) {
      return toast.error('Error Creating Backlog!');
    }

    toast.success('Backlog Created!');
  };

  return (
    <div className="flex justify-center items-center mt-10 prose dark:prose-invert max-w-none flex-col">
      <h1>Select Product Backlog</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          label="Database"
          control={control}
          name="databaseId"
          error={errors.databaseId}
          options={databaseOptions}
          rules={{ required: true }}
          loading={!data && !error}
        />

        <h3>Select Columns</h3>
        <SelectField
          label="Story Points (number field)"
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
          disabled={!currentDatabaseSelected}
        />
        <SelectField
          label="Status (select field)"
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
          disabled={!currentDatabaseSelected}
        />

        <SelectField
          label="Sprint (select field)"
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
          disabled={!currentDatabaseSelected}
        />

        <h3>Select Status Mappings</h3>
        <SelectField
          label="Done"
          control={control}
          name="statusMapping.statusDoneId"
          options={[]}
        />
        <SelectField
          label="To Validate (optional)"
          control={control}
          name="statusMapping.statusToValidateId"
          options={[]}
        />
        <SelectField
          label="In Progress"
          control={control}
          name="statusMapping.statusInProgressId"
          options={[]}
        />
        <SelectField
          label="To Do"
          control={control}
          name="statusMapping.statusToDoId"
          options={[]}
        />

        <Button type="submit" className="mt-4 text-center">
          Add Database to Xeo
        </Button>
      </form>
    </div>
  );
};
