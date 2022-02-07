import { Range, Input } from '@xeo/ui';
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

  const valueToShow = value ? String(value) : defaultValue;

  return (
    <div className="flex flex-row">
      <Range
        className="mr-4 grow"
        min={0}
        max={1}
        step={0.1}
        label=""
        defaultValue={valueToShow}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onMouseUp={handleOnChange}
      />
      <Input
        className="w-16"
        type="number"
        min={0}
        max={1}
        step={0.1}
        label=""
        value={valueToShow}
        defaultValue={valueToShow}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default CapacitySlider;
