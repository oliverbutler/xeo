import { TrashIcon } from '@heroicons/react/outline';
import { Sprint } from '@prisma/client';
import {
  Button,
  ButtonVariation,
  DateRangePickerField,
  Input,
  Table,
  Clickable,
} from '@xeo/ui';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useFieldArray, useForm, UseFormRegister } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { getDaysArray } from 'utils/sprint/chart';
import { CapacitySlider } from './CapacitySlider';
import { v4 } from 'uuid';
import React, { useMemo } from 'react';

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
  devs: { id: string; name: string; capacity: number[] }[];
}

interface SprintCapacityTableRow {
  date: Date;
}

type SprintEditDeveloperHeader = {
  id: string;
  index: number;
  remove: (index: number) => void;
  register: UseFormRegister<SprintEditForm>;
};

const SprintEditDeveloperHeader: React.FunctionComponent<
  SprintEditDeveloperHeader
> = ({ id, remove, index, register }) => {
  return (
    <div className="flex w-48 flex-row" key={id}>
      <Input
        label=""
        // value={value}
        placeholder="Developer"
        // onChange={(e) => setValue(e.target.value)}
        {...register(`devs.${index}.name`)}
      />
      <div className="mt-2 ml-2">
        <Clickable onClick={() => remove(index)}>
          <TrashIcon height={25} width={25} />
        </Clickable>
      </div>
    </div>
  );
};

export const SprintEdit: React.FunctionComponent<Props> = ({ sprint }) => {
  const { control, register, watch } = useForm<SprintEditForm>({
    defaultValues: {
      startDate: new Date(sprint.startDate).toISOString(),
      endDate: new Date(sprint.endDate).toISOString(),
      notionSprintValue: sprint.notionSprintValue,
      devs: [
        { id: v4(), name: 'Olly', capacity: [] },
        { id: v4(), name: 'John', capacity: [] },
      ],
    },
  });

  const { fields, remove, append } = useFieldArray({
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

  const columns: Column<SprintCapacityTableRow>[] = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (cell) => dayjs(cell.value).format('ddd DD/MM'),
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...fields.map(({ id }, index) => ({
        Header: () => (
          <SprintEditDeveloperHeader
            id={id}
            index={index}
            remove={remove}
            register={register}
          />
        ),
        label: 'Dev',
        id: `dev-${id}`,
        Cell: (
          cell: React.PropsWithChildren<
            CellProps<SprintCapacityTableRow, unknown>
          >
        ) => (
          <CapacitySlider
            control={control}
            name={`devs.${index}.capacity.${cell.row.index}`}
            defaultValue={1}
          />
        ),
      })),
    ],
    [control, fields, register, remove]
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
        <h2>Sprint Speed</h2>
        <Table<SprintCapacityTableRow>
          columns={columns}
          data={sprintCapacityTableRows}
        />
        <Button className="mt-4" onClick={() => append({ name: '', id: v4() })}>
          Add New Dev
        </Button>
      </form>
    </div>
  );
};
