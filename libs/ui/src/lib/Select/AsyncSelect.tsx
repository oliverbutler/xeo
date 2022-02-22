import classNames from 'classnames';
import { FieldError } from 'react-hook-form';
import AsyncReactSelect, {
  AsyncProps as ReactSelectProps,
} from 'react-select/async';

export type AsyncSelectProps<T extends object> = {
  label: string;
  error?: FieldError | undefined;
} & ReactSelectProps<T, false, { options: T[]; label: string }>;

export const AsyncSelect = <T extends object>({
  label,
  error,
  className,
  isDisabled,
  ...selectProps
}: AsyncSelectProps<T>) => {
  return (
    <div
      className={classNames(
        'text-dark-700 dark:text-white',
        { 'opacity-50': isDisabled },
        className
      )}
    >
      <label className="mb-2 block text-sm font-bold">{label}</label>
      <AsyncReactSelect
        menuPortalTarget={document.body}
        styles={{
          option: (styles) => ({ ...styles, color: 'black' }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        isDisabled={isDisabled}
        {...selectProps}
      />
    </div>
  );
};

export default AsyncSelect;
