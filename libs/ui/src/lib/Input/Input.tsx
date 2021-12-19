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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <div className="text-dark-700 dark:text-white ">
        <label className="block  text-sm font-bold mb-2">{label}</label>
        <input
          ref={ref}
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none bg-transparent focus:shadow-outline ',
            { 'border-red-500': error }
          )}
          aria-label={label}
          {...inputProps}
        />
        {error && (
          <p className="text-red-500 text-xs italic">{error.message}</p>
        )}
      </div>
    );
  }
);

export default Input;
