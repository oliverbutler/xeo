import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { UseFormReturn } from 'react-hook-form';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import {
  DatabaseSelectionForm,
  DatabaseSelectionOption,
} from './useCreateNotionBacklog';

interface Props {
  form: UseFormReturn<DatabaseSelectionForm>;
  databases: AvailableDatabasesFromNotion | undefined;
}
export const SelectDatabase: React.FunctionComponent<Props> = ({
  form: { control },
  databases,
}) => {
  const databaseOptions: DatabaseSelectionOption[] =
    databases?.databases?.map((database) => ({
      label: database.title,
      value: database.id,
      properties: database.properties,
    })) ?? [];

  return (
    <SelectField
      label="Database"
      control={control}
      name="database"
      options={databaseOptions}
      rules={{ required: true }}
      isLoading={!databases}
      isClearable
    />
  );
};
