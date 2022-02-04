import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
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
  const {
    field: { value, onChange },
  } = useController({ control, name, rules });

  return <Select {...props} value={value} onChange={onChange} />;
};

export default SelectField;
