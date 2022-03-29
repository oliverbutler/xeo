import { BacklogStatus, NotionStatusLink } from '@prisma/client';
import { Table } from '@xeo/ui/lib/Table/Table';
import { ListboxField } from '@xeo/ui/lib/Listbox/ListboxField';
import { NotionDatabaseWithStatusLinks } from 'pages/api/team/[teamId]/notion';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import {
  DatabaseStatusOptions,
  DatabaseUpdateForm,
} from './useUpdateNotionDatabase';
import { Button } from '@xeo/ui/lib/Button/Button';
import { ArchiveIcon, CheckIcon, TrashIcon } from '@heroicons/react/outline';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { CANCELLED } from 'dns';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { Alert } from '@xeo/ui/lib/Alert/Alert';

interface SelectStatusMappingProps {
  form: UseFormReturn<DatabaseUpdateForm>;
  notionDatabase: AvailableDatabasesFromNotion['databases'][0];
  database: NotionDatabaseWithStatusLinks;
  availableStatusOptions: DatabaseStatusOptions[];
}

export const SelectStatusMapping: React.FunctionComponent<
  SelectStatusMappingProps
> = ({ form: { control }, availableStatusOptions }) => {
  const backlogStatusOptions = [
    { label: 'Sprint Backlog', value: BacklogStatus.SPRINT_BACKLOG },
    { label: 'In Progress', value: BacklogStatus.IN_PROGRESS },
    { label: 'Done', value: BacklogStatus.DONE },
    { label: 'To Validate', value: BacklogStatus.TO_VALIDATE },
  ];

  const { fields, insert, update, remove } = useFieldArray({
    control,
    name: 'updatedStatusMappings',
  });

  const handleInsert = () => {
    insert(fields.length, {
      state: 'new',
    });
  };

  return (
    <div>
      <h3>Update Status Mappings</h3>
      <p>Change Database → re-map the columns</p>
      <p>Deleted a Column → re-map or archive</p>

      <Table<DatabaseUpdateForm['updatedStatusMappings'][0]>
        data={fields}
        columns={[
          {
            Header: 'Notion Column',
            accessor: 'notionSelectId',
            disableSortBy: true,
            Cell: (cell) => (
              <div>
                <ListboxField
                  control={control}
                  name={`updatedStatusMappings.${cell.row.index}.notionSelectId`}
                  options={availableStatusOptions}
                  isDisabled={cell.row.original.state === 'deleted'}
                />
                <small className="text-red-400">
                  {cell.value === null && cell.row.original.state !== 'deleted'
                    ? `"${cell.row.original.notionSelectName}" missing, re-map the column or delete it`
                    : null}
                </small>
                {cell.row.original.state === 'deleted' ? (
                  <small className="text-dark-400">
                    Deleted "{cell.row.original.notionSelectName}", used for old
                    tickets
                  </small>
                ) : null}
              </div>
            ),
          },
          {
            Header: 'Mapped Status',
            disableSortBy: true,
            accessor: 'status',
            Cell: (cell) => (
              <ListboxField
                control={control}
                name={`updatedStatusMappings.${cell.row.index}.status`}
                options={backlogStatusOptions}
                isDisabled={cell.row.original.state === 'deleted'}
              />
            ),
          },
          {
            Header: '',
            disableSortBy: true,
            accessor: 'statusLinkId',
            Cell: (cell) => (
              <div className="flex flex-row">
                {cell.row.original.state === 'deleted' ? (
                  <Tooltip tooltip="Restore">
                    <Clickable
                      onClick={() =>
                        update(cell.row.index, {
                          ...cell.row.original,
                          state: 'updated',
                        })
                      }
                    >
                      <CheckIcon
                        height={20}
                        width={20}
                        className="text-green-400"
                      />
                    </Clickable>
                  </Tooltip>
                ) : (
                  <Tooltip tooltip="Archive">
                    <Clickable
                      onClick={() => {
                        if (cell.row.original.state === 'updated') {
                          update(cell.row.index, {
                            ...cell.row.original,
                            state: 'deleted',
                          });
                        } else {
                          remove(cell.row.index);
                        }
                      }}
                    >
                      <ArchiveIcon
                        height={20}
                        width={20}
                        className="text-yellow-400"
                      />
                    </Clickable>
                  </Tooltip>
                )}
                <span>{cell.row.original.state === 'new' ? '(new)' : ''}</span>
              </div>
            ),
          },
        ]}
      />
      <Button className="mt-2 ml-2" variation="tertiary" onClick={handleInsert}>
        Add Status
      </Button>
    </div>
  );
};
