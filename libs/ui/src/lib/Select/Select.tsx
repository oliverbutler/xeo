import classNames from 'classnames';
import { FieldError } from 'react-hook-form';
import ReactSelect, {
  Props as ReactSelectProps,
  OptionProps,
} from 'react-select';

export type SelectOptionType = OptionProps;

export type SelectProps = {
  label: string;
  error?: FieldError | undefined;
} & ReactSelectProps;

export const Select = ({
  label,
  error,
  className,
  isDisabled,
  ...selectProps
}: SelectProps) => {
  return (
    <div
      className={classNames(
        'text-dark-700 dark:text-white',
        { 'opacity-50': isDisabled },
        className
      )}
    >
      <label className="mb-2 block text-sm font-bold">{label}</label>
      <ReactSelect
        menuPortalTarget={document.body}
        styles={{
          option: (styles) => ({
            ...styles,
            color: 'black',
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        isDisabled={isDisabled}
        {...selectProps}
      />
    </div>
  );
};

export default Select;
