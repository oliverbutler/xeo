import classNames from 'classnames';
import { forwardRef } from 'react';
import { Loader } from '../Animate/Loader/Loader';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import Link from 'next/link';

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  loading?: boolean;
  colour?: ButtonColour;
  variation?: 'primary' | 'tertiary';
  href?: string;
  hrefNewTab?: boolean;
}

export enum ButtonColour {
  Primary = 'primary',
  Danger = 'danger',
  Secondary = 'secondary',
  Dark = 'dark',
}

const getButtonStyles = (
  colour: ButtonColour,
  variation: ButtonProps['variation'],
  disabled: boolean
) => {
  if (variation === 'primary') {
    return classNames(
      {
        'text-white bg-primary-500 hover:bg-primary-700 ring-primary-500':
          colour === ButtonColour.Primary && !disabled,
      },
      {
        'text-white bg-secondary-500 hover:bg-secondary-700 ring-secondary-500':
          colour === ButtonColour.Secondary && !disabled,
      },
      {
        'text-white bg-red-500 ring-red-500 hover:bg-red-700':
          colour === ButtonColour.Danger && !disabled,
      },
      {
        'text-white bg-dark-500 ring-dark-500':
          colour === ButtonColour.Dark || disabled,
      },
      {
        'text-white hover:bg-dark-700':
          colour === ButtonColour.Dark && !disabled,
      }
    );
  } else {
    return classNames(
      {
        'text-primary-500 hover:bg-primary-700/10 ring-primary-500':
          colour === ButtonColour.Primary && !disabled,
      },
      {
        'text-secondary-500 hover:bg-secondary-700/10 ring-secondary-500':
          colour === ButtonColour.Secondary && !disabled,
      },
      {
        'text-red-500 ring-red-500 hover:bg-red-700/10':
          colour === ButtonColour.Danger && !disabled,
      },
      {
        'text-dark-500 ring-dark-500': colour === ButtonColour.Dark || disabled,
      },
      {
        'hover:bg-dark-700/10': colour === ButtonColour.Dark && !disabled,
      }
    );
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading,
      children,
      className,
      variation = 'primary',
      colour = ButtonColour.Primary,
      href,
      hrefNewTab,
      disabled = false,
      ...buttonProps
    },
    ref
  ) => {
    return (
      <ConditionalWrapper
        condition={!!href}
        wrapper={(children) => (
          <Link
            href={href as string}
            {...(hrefNewTab ? { target: '_blank' } : undefined)}
          >
            {children}
          </Link>
        )}
      >
        <button
          ref={ref}
          className={classNames(
            ' focus:shadow-outline flex items-center rounded py-2 px-4 font-bold ring-opacity-50 focus:outline-none focus:ring-4',
            getButtonStyles(colour, variation, disabled),
            className
          )}
          type="button"
          disabled={disabled}
          {...buttonProps}
        >
          {loading && <Loader />}
          {children}
        </button>
      </ConditionalWrapper>
    );
  }
);

export default Button;
