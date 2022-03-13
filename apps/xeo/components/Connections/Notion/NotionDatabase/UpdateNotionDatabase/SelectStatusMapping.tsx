import { Alert } from '@xeo/ui/lib/Alert/Alert';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { UseFormReturn } from 'react-hook-form';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { DatabaseUpdateForm } from './useUpdateNotionDatabase';

interface SelectStatusMappingProps {
  form: UseFormReturn<DatabaseUpdateForm>;
  database: AvailableDatabasesFromNotion['databases'][0];
}

export const SelectStatusMapping: React.FunctionComponent<
  SelectStatusMappingProps
> = ({ form: { control, watch }, database }) => {
  const availableDatabaseProperties = database
    ? Object.values(database.properties)
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

  return (
    <div>
      <h3>Select Status Mappings</h3>
      <Alert variation="warning">
        <span>
          Status Mappings are currently not editable, I would only change the
          "Status" if you renamed it.
        </span>
      </Alert>
      {/* <SelectField
        label="Done"
        control={control}
        name="statusMapping.statusDoneId"
        options={availableStatusOptions}
        isDisabled={true}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="To Validate"
        control={control}
        name="statusMapping.statusToValidateId"
        options={availableStatusOptions}
        isDisabled={true}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="In Progress"
        control={control}
        name="statusMapping.statusInProgressId"
        options={availableStatusOptions}
        isDisabled={true}
        isMulti
      />
      <SelectField
        className="mt-2"
        label="Sprint Backlog"
        control={control}
        name="statusMapping.statusSprintBacklogId"
        options={availableStatusOptions}
        isDisabled={true}
        isMulti
      /> */}
    </div>
  );
};
