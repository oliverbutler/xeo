import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { UseFormReturn } from 'react-hook-form';
import { DatabaseSelectionForm } from './useCreateNotionBacklog';

interface SelectStatusMappingProps {
  form: UseFormReturn<DatabaseSelectionForm>;
}

export const SelectStatusMapping: React.FunctionComponent<
  SelectStatusMappingProps
> = ({ form: { control, watch } }) => {
  const currentDatabaseSelected = watch('database');

  const availableDatabaseProperties = currentDatabaseSelected
    ? Object.values(currentDatabaseSelected.properties)
    : [];

  // Get select options
  const ticketStatusColumn = watch('ticketStatusId');
  const ticketStatusColumnProperty = availableDatabaseProperties.find(
    (property) => property.id === ticketStatusColumn?.value
  );
  const availableStatusOptions =
    ticketStatusColumnProperty?.type === 'select'
      ? ticketStatusColumnProperty.select.options.map((option) => ({
          label: option.name,
          value: option.name,
          notionId: option.id,
          color: option.color ?? 'gray',
        }))
      : [];

  return (
    <div>
      <h3>Select Status Mappings</h3>
      <p>
        Add mappings between the available statuses in Notion with Xeo statuses,
        you can have <b>multiple per input</b>
      </p>
      <SelectField
        label="Done"
        control={control}
        name="statusMapping.statusDoneId"
        options={availableStatusOptions}
        isDisabled={!currentDatabaseSelected}
        isMulti
        rules={{ required: true }}
      />
      <SelectField
        className="mt-2"
        label="To Validate (Optional)"
        control={control}
        name="statusMapping.statusToValidateId"
        options={availableStatusOptions}
        isDisabled={!currentDatabaseSelected}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="In Progress"
        control={control}
        name="statusMapping.statusInProgressId"
        options={availableStatusOptions}
        isDisabled={!currentDatabaseSelected}
        isMulti
        rules={{ required: true }}
      />
      <SelectField
        className="mt-2"
        label="Sprint Backlog"
        control={control}
        name="statusMapping.statusSprintBacklogId"
        options={availableStatusOptions}
        isDisabled={!currentDatabaseSelected}
        isMulti
        rules={{ required: true }}
      />
    </div>
  );
};
