import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loader } from '../Animate/Loader/Loader';

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  variation?: ButtonVariation;
}

export enum ButtonVariation {
  Primary = 'primary',
  Secondary = 'secondary',
  Dark = 'dark',
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  loading,
  children,
  className,
  variation = ButtonVariation.Primary,
  ...buttonProps
}) => {
  return (
    <button
      className={classNames(
        ' text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center focus:ring-4 ring-opacity-50',
        { 'cursor-wait opacity-70': loading },
        {
          'bg-primary-500 hover:bg-primary-700':
            variation === ButtonVariation.Primary,
        },
        {
          'bg-secondary-500 hover:bg-secondary-700':
            variation === ButtonVariation.Secondary,
        },
        {
          'bg-dark-500 hover:bg-dark-700': variation === ButtonVariation.Dark,
        },
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
