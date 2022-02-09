import moment from 'moment';
import {
  Control,
  FieldValues,
  Path,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import DateRangePicker from './DateRangePicker';

interface ReusableInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  startDateFieldName: Path<T>;
  endDateFieldName: Path<T>;
  useControllerOptions?: Omit<
    UseControllerProps<T, Path<T>>,
    'control' | 'name'
  >;
  label?: string;
}

type ReusableInputField = <T extends FieldValues>({
  control,
  startDateFieldName,
  endDateFieldName,
  label,
  useControllerOptions,
}: ReusableInputFieldProps<T>) => React.ReactElement;

export const DateRangePickerField: ReusableInputField = ({
  control,
  startDateFieldName,
  endDateFieldName,
  label,
}) => {
  const {
    field: { value: startDate, onChange: onChangeStartDate },
  } = useController({ control: control, name: startDateFieldName });

  const {
    field: { value: endDate, onChange: onChangeEndDate },
  } = useController({ control: control, name: endDateFieldName });

  return (
    <div className="text-dark-700 dark:text-white ">
      <label className="mb-2 block text-sm font-bold">{label}</label>

      <DateRangePicker
        startDateId={startDateFieldName}
        endDateId={endDateFieldName}
        startDate={moment(startDate)}
        endDate={moment(endDate)}
        onDatesChange={({ startDate, endDate }) => {
          onChangeStartDate(startDate?.toISOString());
          onChangeEndDate(endDate?.toISOString());
        }}
      />
    </div>
  );
};
