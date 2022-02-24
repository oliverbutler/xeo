import classNames from 'classnames';
import { forwardRef } from 'react';
import { FieldError } from '../../../../../node_modules/react-hook-form/dist';

export interface InputProps extends React.ComponentPropsWithRef<'input'> {
  label: string;
  error?: FieldError | undefined;
  className?: string;
  disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, disabled, ...inputProps }, ref) => {
    return (
      <div
        className={classNames(
          'text-dark-800 dark:text-white',
          { 'opacity-50': disabled },
          className
        )}
      >
        <label className="mb-2 block text-sm font-bold">{label}</label>
        <input
          ref={ref}
          disabled={disabled}
          aria-disabled={disabled}
          className={classNames(
            'dark:bg-dark-900 dark:ring-dark-800  ring-dark-200 focus:ring-primary-300 dark:focus:ring-dark-600  w-full  appearance-none rounded bg-white py-2  px-3 leading-tight outline-0 ring-2 dark:ring-2 ',
            { 'ring-red-500': error },
            { 'w-min p-0': type === 'checkbox' }
          )}
          aria-label={label}
          type={type}
          {...inputProps}
        />
        {error && (
          <p className="text-xs italic text-red-500">{error.message}</p>
        )}
      </div>
    );
  }
);

export default Input;
