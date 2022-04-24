import { NotionColumnType, NotionDatabase } from '@prisma/client';
import { ListboxField } from '@xeo/ui/lib/Listbox/ListboxField';
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
    <div className="space-y-2">
      <h3>Select Columns</h3>
      <ListboxField
        label="Story Points (number field)"
        control={control}
        name="pointsColumnName"
        options={propertiesOptions.filter((o) => o.type === 'number')}
        rules={{ required: true }}
        isDisabled={!database}
      />

      <ListboxField
        label="Parent Tickets Relation (optional)"
        control={control}
        name="parentRelationColumnName"
        options={propertiesOptions.filter((o) => o.type === 'relation')}
        rules={{ required: false }}
        isDisabled={!database}
      />
      <ListboxField
        label="Epic Relation (optional)"
        control={control}
        name="epicRelationColumnId"
        options={propertiesOptions.filter((o) => o.type === 'relation')}
        rules={{ required: false }}
        isDisabled={!database}
      />
      <div className="flex flex-col space-x-4 sm:flex-row">
        <ListboxField
          className="w-full sm:w-1/2"
          label="Sprint Field Type"
          control={control}
          name="sprintSelectType"
          options={sprintSelectTypeOptions}
          isDisabled={true}
          rules={{ required: true }}
        />
        <ListboxField
          className="w-full sm:w-1/2"
          label="Sprint"
          control={control}
          name="sprintColumnName"
          options={propertiesOptions.filter((o) =>
            isNotionPropertyColumn(o, currentSprintSelectType)
          )}
          rules={{ required: true }}
          isDisabled={!database || !currentSprintSelectType}
        />
      </div>
    </div>
  );
};
