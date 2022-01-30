import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import Select, { SelectProps } from './Select';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & Omit<SelectProps, 'value' | 'onChange'>;

export const SelectField = <T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: Props<T>): React.ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <Select value={value} onChange={onChange} {...props} />
      )}
    ></Controller>
  );
};

export default SelectField;
