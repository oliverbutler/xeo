import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from '../../../../../node_modules/react-hook-form/dist';

type Props = {
  label: string;
  error: FieldError;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <input
          ref={ref}
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
            { 'border-red-500': error }
          )}
          {...inputProps}
        />
        {error && (
          <p className="text-red-500 text-xs italic">{error.message}</p>
        )}
      </div>
    );
  }
);
