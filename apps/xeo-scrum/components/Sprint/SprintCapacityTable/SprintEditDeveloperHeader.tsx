import { TrashIcon } from '@heroicons/react/outline';
import { Clickable, Input } from '@xeo/ui';
import {
  DeepMap,
  DeepPartial,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

type SprintEditDeveloperHeaderProps<T extends FieldValues> = {
  id: string;
  index: number;
  remove: (index: number) => void;
  register: UseFormRegister<T>;
  devNameFieldNameFactory: (devIndex: number) => Path<T>;
  errors: DeepMap<DeepPartial<T>, FieldError>;
};

export const SprintEditDeveloperHeader = <T extends FieldValues>({
  id,
  remove,
  index,
  register,
  devNameFieldNameFactory,
  errors,
}: SprintEditDeveloperHeaderProps<T>) => {
  return (
    <div className="flex w-32 flex-row" key={id}>
      <Input
        label=""
        placeholder={`Dev ${index + 1}`}
        error={errors[devNameFieldNameFactory(index)]}
        {...register(devNameFieldNameFactory(index), { required: true })}
      />
      <div className="mt-2 ml-2">
        <Clickable onClick={() => remove(index)}>
          <TrashIcon height={25} width={25} />
        </Clickable>
      </div>
    </div>
  );
};
