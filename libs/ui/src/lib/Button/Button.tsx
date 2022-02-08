import classNames from 'classnames';
import { forwardRef } from 'react';
import { Loader } from '../Animate/Loader/Loader';

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  loading?: boolean;
  variation?: ButtonVariation;
}

export enum ButtonVariation {
  Primary = 'primary',
  Secondary = 'secondary',
  Dark = 'dark',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading,
      children,
      className,
      variation = ButtonVariation.Primary,
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          ' focus:shadow-outline flex items-center rounded py-2 px-4 font-bold text-white ring-opacity-50 focus:outline-none focus:ring-4',
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
  }
);

export default Button;
