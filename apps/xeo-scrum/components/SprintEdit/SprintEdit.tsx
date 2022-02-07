import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { Sprint } from '@prisma/client';
import {
  Button,
  ButtonVariation,
  DateRangePickerField,
  Input,
  Table,
} from '@xeo/ui';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { Cell, CellProps } from 'react-table';
import { getDaysArray } from 'utils/sprint/chart';
import { CapacitySlider } from './CapacitySlider';

interface Props {
  sprint: Sprint;
}

interface SprintEditForm {
  startDate: string;
  endDate: string;
  sprintName: string;
  notionSprintValue: string;
  sprintGoal: string;
  teamSpeed: number;
  capacity: number[][];
  devs: { name: string }[];
}

interface SprintCapacityTableRow {
  date: Date;
}

interface DeveloperTableRow {
  name: string;
}

export const SprintEdit: React.FunctionComponent<Props> = ({ sprint }) => {
  const { control, register, watch } = useForm<SprintEditForm>({
    defaultValues: {
      startDate: new Date(sprint.startDate).toISOString(),
      endDate: new Date(sprint.endDate).toISOString(),
      notionSprintValue: sprint.notionSprintValue,
      capacity: [[0.5, 0]],
      devs: [{ name: 'Olly' }, { name: 'John' }],
    },
  });

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'devs',
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const sprintDays = getDaysArray(new Date(startDate), new Date(endDate));

  const sprintCapacityTableRows: SprintCapacityTableRow[] = sprintDays.map(
    (date) => {
      return {
        date,
      };
    }
  );

  return (
    <div className="w-full p-10">
      <div className="flex flex-row justify-between">
        <h1>Edit Sprint - {sprint.name}</h1>
        <div>
          <Link href={`/sprint/${sprint.id}`} passHref>
            <Button variation={ButtonVariation.Secondary}>Back</Button>
          </Link>
        </div>
      </div>
      <form className="gap-4">
        <div className="flex flex-row gap-4">
          <Input
            className="w-1/3"
            label="Sprint Name"
            {...register('sprintName')}
          />
          <Input
            className="w-2/3"
            label="Sprint Goal"
            {...register('sprintGoal')}
            placeholder="AaU I can..."
          />
        </div>
        <div className="mt-4 flex flex-grow flex-row gap-4">
          <DateRangePickerField
            control={control}
            startDateFieldName="startDate"
            endDateFieldName="endDate"
            label="Sprint Dates"
          />
          <Input
            className="w-1/3"
            label="Notion Sprint Value"
            {...register('notionSprintValue')}
          />

          <Input
            className="w-1/3"
            label="Team Speed"
            {...register('teamSpeed')}
          />
        </div>
        <div className="w-72">
          <h2>Devs</h2>
          <Table<DeveloperTableRow>
            columns={[
              {
                Header: 'Name',
                accessor: 'name',
                Cell: ({ cell: { row } }) => (
                  <Input label="" {...register(`devs.${row.index}.name`)} />
                ),
              },
              {
                Header: 'Actions',
                Cell: (cell: Cell<DeveloperTableRow, unknown>) => (
                  <Button onClick={() => remove(cell.row.index)}>
                    <TrashIcon height={15} width={15} />
                  </Button>
                ),
              },
            ]}
            data={fields}
          />
        </div>
        <Button onClick={() => append({ name: '' })}>
          <span className="mr-2">Add new Dev</span>
          <PlusIcon height={15} width={15} />
        </Button>
        <h2>Sprint Speed</h2>
        <Table<SprintCapacityTableRow>
          columns={[
            {
              Header: 'Date',
              accessor: 'date',
              Cell: (cell) => dayjs(cell.value).format('ddd DD/MM'),
            },
            ...fields.map(({ name }, index) => ({
              Header: name,
              Cell: (
                cell: React.PropsWithChildren<
                  CellProps<SprintCapacityTableRow, unknown>
                >
              ) => (
                <CapacitySlider
                  control={control}
                  name={`capacity.${cell.row.index}.${index}`}
                  defaultValue={1}
                />
              ),
            })),
          ]}
          data={sprintCapacityTableRows}
        />
      </form>
    </div>
  );
};
