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
      ...(watch('statusMapping.statusToValidateId') ?? []),
    ].every((x) => x.value !== option.value)
  );

  return (
    <div>
      <h3>Select Status Mappings</h3>
      <p>To Validate is a column used by some SCRUM teams, it is optional.</p>
      <SelectField
        label="Done"
        control={control}
        name="statusMapping.statusDoneId"
        options={availableStatusOptions}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="To Validate"
        control={control}
        name="statusMapping.statusToValidateId"
        options={availableStatusOptions}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="In Progress"
        control={control}
        name="statusMapping.statusInProgressId"
        options={availableStatusOptions}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="Sprint Backlog"
        control={control}
        name="statusMapping.statusSprintBacklogId"
        options={availableStatusOptions}
        isMulti
      />
      <p className="w-72">
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
