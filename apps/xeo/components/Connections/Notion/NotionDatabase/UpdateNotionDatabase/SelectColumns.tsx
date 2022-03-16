import { NotionColumnType, NotionDatabase } from '@prisma/client';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { UseFormReturn } from 'react-hook-form';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import {
  DatabasePropertyOption,
  DatabaseUpdateForm,
  DatabaseSprintFieldType,
} from './useUpdateNotionDatabase';

interface Props {
  form: UseFormReturn<DatabaseUpdateForm>;
  database: AvailableDatabasesFromNotion['databases'][0];
}

export const sprintSelectTypeOptions: DatabaseSprintFieldType[] = [
  {
    value: NotionColumnType.SELECT,
    label: 'Select',
  },
  {
    value: NotionColumnType.MULTI_SELECT,
    label: 'Multi Select',
  },
  {
    value: NotionColumnType.RELATIONSHIP_ID,
    label: 'Relationship',
  },
];

export const SelectColumns: React.FunctionComponent<Props> = ({
  form: { control, watch },
  database,
}) => {
  const currentSprintSelectType = watch('sprintSelectType');

  const availableDatabaseProperties = database
    ? Object.values(database.properties)
    : [];

  const isNotionPropertyColumn = (
    property: DatabasePropertyOption,
    notionColumnType: NotionColumnType | undefined
  ) => {
    switch (notionColumnType) {
      case NotionColumnType.MULTI_SELECT:
        return property.type === 'multi_select';
      case NotionColumnType.SELECT:
        return property.type === 'select';
      case NotionColumnType.RELATIONSHIP_ID:
        return property.type === 'relation';
    }
    return false;
  };

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
        isDisabled={!database}
      />
      <SelectField
        className="mt-2"
        label="Status (select field)"
        control={control}
        name="ticketStatusId"
        // error={errors.ticketStatusId}
        options={propertiesOptions.filter((o) => o.type === 'select')}
        rules={{ required: true }}
        isDisabled={!database}
      />
      <SelectField
        className="mt-2"
        label="Parents Relation (optional)"
        control={control}
        name="parentRelation"
        // error={errors.ticketStatusId}
        options={propertiesOptions.filter((o) => o.type === 'relation')}
        rules={{ required: false }}
        isDisabled={!database}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <SelectField
          className="mt-2 w-full sm:w-1/2"
          label="Sprint Field Type"
          control={control}
          name="sprintSelectType"
          options={sprintSelectTypeOptions}
          isDisabled={true}
          rules={{ required: true }}
        />
        <SelectField
          className="mt-2 w-full sm:w-1/2"
          label="Sprint"
          control={control}
          name="sprintId"
          // error={errors.sprintId}
          options={propertiesOptions.filter((o) =>
            isNotionPropertyColumn(o, currentSprintSelectType?.value)
          )}
          rules={{ required: true }}
          isDisabled={!database || !currentSprintSelectType}
        />
      </div>
    </div>
  );
};
