import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseControllerProps,
} from 'react-hook-form';
import DatePicker from './DatePicker';

interface ReusableInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  fieldName: Path<T>;
  useControllerOptions?: Omit<
    UseControllerProps<T, Path<T>>,
    'control' | 'name'
  >;
  label?: string;
}

export type ForeignExchangeSupplierInputField = <T extends FieldValues>({
  control,
  fieldName,
  label,
  useControllerOptions,
}: ReusableInputFieldProps<T>) => React.ReactElement;

export const DatePickerField: ForeignExchangeSupplierInputField = ({
  control,
  fieldName,
  label,
  useControllerOptions,
}) => {
  return (
    <div className="text-dark-700 dark:text-white ">
      <label className="block text-sm font-bold mb-2">{label}</label>
      <Controller
        control={control}
        name={fieldName}
        {...useControllerOptions}
        render={({ field: { value, onChange } }) => (
          <DatePicker
            id={fieldName}
            date={value}
            onDateChange={(date) => onChange(date)}
          />
        )}
      />
    </div>
  );
};
