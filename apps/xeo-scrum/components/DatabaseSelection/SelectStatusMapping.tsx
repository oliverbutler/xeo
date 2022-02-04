import { SelectField } from '@xeo/ui';
import { UseFormReturn } from 'react-hook-form';
import { DatabaseSelectionForm } from './useDatabaseSelection';

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
          color: option.color ?? 'gray',
        }))
      : [];

  const unPickedOptions = availableStatusOptions.filter((option) =>
    [
      ...(watch('statusMapping.statusDoneId') ?? []),
      ...(watch('statusMapping.statusSprintBacklogId') ?? []),
      ...(watch('statusMapping.statusInProgressId') ?? []),
    ].every((x) => x.value !== option.value)
  );

  return (
    <div>
      <h3>Select Status Mappings</h3>
      <SelectField
        label="Done"
        control={control}
        name="statusMapping.statusDoneId"
        options={availableStatusOptions}
        isMulti
      />
      <SelectField
        label="In Progress"
        control={control}
        name="statusMapping.statusInProgressId"
        options={availableStatusOptions}
        isMulti
      />
      <SelectField
        label="Sprint Backlog"
        control={control}
        name="statusMapping.statusSprintBacklogId"
        options={availableStatusOptions}
        isMulti
      />
      <p className="break-words w-72">
        Remaining Options:{' '}
        {unPickedOptions.map((opt, index) => (
          <span key={opt.value}>
            {opt.label}
            {index === unPickedOptions.length - 1 ? '' : ','}{' '}
          </span>
        ))}
      </p>
    </div>
  );
};