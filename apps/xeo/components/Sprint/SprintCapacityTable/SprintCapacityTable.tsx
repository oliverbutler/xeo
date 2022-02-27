import { UserAddIcon } from '@heroicons/react/outline';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { Table } from '@xeo/ui/lib/Table/Table';
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
import { getBusinessDaysArray } from 'utils/sprint/chart';
import { v4 } from 'uuid';
import CapacitySlider from '../SprintEdit/CapacitySlider';
import { SprintCapacityCalculation } from './SprintCapacityCalculation';
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
  teamSpeed: number;
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
  teamSpeed,
  form: {
    control,
    watch,
    register,
    formState: { errors },
  },
  defaultCapacity,
  devFieldName,
  devNameFieldNameFactory,
  capacityFieldNameFactory,
}: Props<T>) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: devFieldName,
  });

  const sprintCapacityTableRows = useMemo(() => {
    const sprintDays = getBusinessDaysArray(startDate, endDate);

    return sprintDays.map((date) => ({
      date,
    }));
  }, [endDate, startDate]);

  const columns: Column<SprintCapacityTableRow>[] = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (cell) => (
          <div className="w-24">{dayjs(cell.value).format('ddd DD/MM')}</div>
        ),
      },
      ...fields.map(({ id }, index) => ({
        Header: () => (
          <SprintEditDeveloperHeader
            id={id}
            index={index}
            remove={remove}
            register={register}
            errors={errors}
            devNameFieldNameFactory={devNameFieldNameFactory}
          />
        ),
        label: 'Dev',
        id: `dev-${id}`,
        Cell: (cell: React.PropsWithChildren<CellProps<T, unknown>>) => (
          <CapacitySlider
            control={control}
            name={capacityFieldNameFactory(index, cell.row.index)}
            defaultValue={defaultCapacity}
          />
        ),
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const devs = watch(devFieldName) as SprintCapacityDev[];

  return (
    <div>
      <div className="flex flex-row items-end justify-between">
        <h2 className="mb-0">Sprint Speed</h2>
        <Clickable
          className="mt-4 flex flex-row"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onClick={() => append({ name: '', id: v4() })}
        >
          <UserAddIcon height={25} width={25} />
        </Clickable>
      </div>
      <div className="my-4">
        <Table<SprintCapacityTableRow>
          columns={columns}
          data={sprintCapacityTableRows}
        />
      </div>
      <SprintCapacityCalculation
        startDate={startDate}
        endDate={endDate}
        devs={devs}
        teamSpeed={teamSpeed}
      />
    </div>
  );
};
