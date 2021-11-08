import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { FieldError } from '../../../../../node_modules/react-hook-form/dist';

type Props = {
  label: string;
  error?: FieldError | undefined;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input: React.FunctionComponent<Props> = ({
  label,
  error,
  ...inputProps
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={classNames(
          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
          { 'border-red-500': error }
        )}
        aria-label={label}
        {...inputProps}
      />
      {error && <p className="text-red-500 text-xs italic">{error.message}</p>}
    </div>
  );
};
