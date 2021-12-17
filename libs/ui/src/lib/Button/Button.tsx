import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loader } from '../Animate/Loader/Loader';

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  loading,
  children,
  className,
  ...buttonProps
}) => {
  return (
    <button
      className={classNames(
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ',
        { 'cursor-wait opacity-70': loading },
        className
      )}
      type="button"
      {...buttonProps}
    >
      {loading && <Loader />}
      {children}
    </button>
  );
};

export default Button;
