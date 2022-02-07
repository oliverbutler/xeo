import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from '../../../../../node_modules/react-hook-form/dist';

/* eslint-disable-next-line */
export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: FieldError | undefined;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    return (
      <div className={classNames('text-dark-700 dark:text-white', className)}>
        <label className="mb-2 block text-sm font-bold">{label}</label>
        <input
          ref={ref}
          className={classNames(
            'focus:shadow-outline text-dark-800 w-full appearance-none rounded border bg-white py-2 px-3 leading-tight shadow focus:outline-none',
            { 'border-red-500': error }
          )}
          aria-label={label}
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
