import Input from '@xeo/ui/lib/Input/Input';
import Range from '@xeo/ui/lib/Range/Range';
import { ChangeEventHandler } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  defaultValue: number;
};

export const CapacitySlider = <T extends FieldValues>({
  control,
  name,
  defaultValue,
}: Props<T>): React.ReactElement => {
  const {
    field: { value, onChange },
  } = useController({ control, name });

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(Number(e.target.value));
  };

  const valueToShow =
    value === null || value === undefined ? defaultValue : String(value);

  return (
    <div className="flex flex-row w-full">
      <Range
        className="mr-4"
        min={0}
        max={1}
        step={0.1}
        label=""
        value={valueToShow}
        onChange={handleOnChange}
      />
      <Input
        className="w-16"
        type="number"
        min={0}
        max={1}
        step={0.05}
        label=""
        required={true}
        value={valueToShow}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default CapacitySlider;
