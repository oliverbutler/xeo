import { UserAddIcon } from '@heroicons/react/outline';
import { Clickable, Table } from '@xeo/ui';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { getDaysArray } from 'utils/sprint/chart';
import { v4 } from 'uuid';
import CapacitySlider from '../SprintEdit/CapacitySlider';
import { SprintEditDeveloperHeader } from './SprintEditDeveloperHeader';

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  devFieldName: ArrayPath<T>;
  capacityFieldNameFactory: (
    devIndex: number,
    capacityIndex: number
  ) => Path<T>;
  devNameFieldNameFactory: (devIndex: number) => Path<T>;
  startDate: Date;
  endDate: Date;
  defaultCapacity: number;
}

interface SprintCapacityTableRow {
  date: Date;
}

export type SprintCapacityDev = {
  id: string;
  name: string;
  capacity: (number | null)[];
};

export const SprintCapacityTable = <T extends FieldValues>({
  startDate,
  endDate,
  form,
  defaultCapacity,
  devFieldName,
  devNameFieldNameFactory,
  capacityFieldNameFactory,
}: Props<T>) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: devFieldName,
  });

  const sprintDays = getDaysArray(startDate, endDate);

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
      ...fields.map(({ id }, index) => ({
        Header: () => (
          <SprintEditDeveloperHeader
            id={id}
            index={index}
            remove={remove}
            register={form.register}
            devNameFieldNameFactory={devNameFieldNameFactory}
          />
        ),
        label: 'Dev',
        id: `dev-${id}`,
        Cell: (cell: React.PropsWithChildren<CellProps<T, unknown>>) => (
          <CapacitySlider
            control={form.control}
            name={capacityFieldNameFactory(index, cell.row.index)}
            defaultValue={defaultCapacity}
          />
        ),
      })),
    ],
    [
      capacityFieldNameFactory,
      defaultCapacity,
      devNameFieldNameFactory,
      fields,
      form.control,
      form.register,
      remove,
    ]
  );

  return (
    <div>
      <div className="flex flex-row items-end justify-between">
        <h2>Sprint Speed</h2>
        <Clickable
          className="mt-4 flex flex-row"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onClick={() => append({ name: '', id: v4() })}
        >
          <UserAddIcon height={25} width={25} />
        </Clickable>
      </div>
      <Table<SprintCapacityTableRow>
        columns={columns}
        data={sprintCapacityTableRows}
      />
    </div>
  );
};
