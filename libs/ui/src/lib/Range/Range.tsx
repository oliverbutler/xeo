import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

/* eslint-disable-next-line */
export interface RangeProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: FieldError | undefined;
  className?: string;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    return (
      <div className={classNames(' dark:text-white', className)}>
        <label className="mb-2 block text-sm font-bold">{label}</label>
        <input
          ref={ref}
          type="range"
          className={classNames(
            'accent-primary-300  w-ful1 h-2 appearance-none rounded-full bg-gray-100 p-0 dark:bg-gray-700 ',
            {
              'border-red-500': error,
            }
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

export default Range;
