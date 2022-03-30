import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import { Listbox, ListboxProps, BaseListboxOption } from './Listbox';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & Omit<ListboxProps<BaseListboxOption>, 'value' | 'onChange'>;

export const ListboxField = <T extends FieldValues>({
  control,
  name,
  rules,
  options,
  ...props
}: Props<T>): React.ReactElement => {
  const {
    field: { value, onChange },
  } = useController({ control, name, rules });

  // Store just the value of the option
  const handleOnChange = (option: BaseListboxOption) => {
    onChange(option.value);
  };

  // Resolve the option from the value
  const optionCurrentlySelected = options.find(
    (option) => option.value === value
  );

  return (
    <Listbox
      {...props}
      value={optionCurrentlySelected}
      options={options}
      onChange={handleOnChange}
    />
  );
};

export default ListboxField;
