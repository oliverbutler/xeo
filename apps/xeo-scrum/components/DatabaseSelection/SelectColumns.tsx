import { SelectField } from '@xeo/ui';
import { UseFormReturn } from 'react-hook-form';
import {
  DatabasePropertyOption,
  DatabaseSelectionForm,
} from './useDatabaseSelection';

interface Props {
  form: UseFormReturn<DatabaseSelectionForm>;
}
export const SelectColumns: React.FunctionComponent<Props> = ({
  form: { control, watch },
}) => {
  const currentDatabaseSelected = watch('database');

  const availableDatabaseProperties = currentDatabaseSelected
    ? Object.values(currentDatabaseSelected.properties)
    : [];

  const propertiesOptions: DatabasePropertyOption[] =
    availableDatabaseProperties.map((property) => ({
      label: property.name,
      value: property.id,
      type: property.type,
    }));

  return (
    <div>
      <h3>Select Columns</h3>
      <SelectField
        label="Story Points (number field)"
        control={control}
        name="storyPointsId"
        // error={errors.storyPointsId}
        options={propertiesOptions.filter((o) => o.type === 'number')}
        rules={{ required: true }}
        isDisabled={!currentDatabaseSelected}
      />
      <SelectField
        label="Status (select field)"
        control={control}
        name="ticketStatusId"
        // error={errors.ticketStatusId}
        options={propertiesOptions.filter((o) => o.type === 'select')}
        rules={{ required: true }}
        isDisabled={!currentDatabaseSelected}
      />

      <SelectField
        label="Sprint (select/multi_select field)"
        control={control}
        name="sprintId"
        // error={errors.sprintId}
        options={propertiesOptions.filter(
          (o) => o.type === 'select' || o.type === 'multi_select'
        )}
        rules={{ required: true }}
        isDisabled={!currentDatabaseSelected}
      />
    </div>
  );
};
