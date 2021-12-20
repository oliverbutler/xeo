import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, HTMLAttributes, useRef } from 'react';

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  active?: boolean;
};

export const Clickable = forwardRef<HTMLDivElement, Props>(
  ({ children, className, active, ...divProps }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          'cursor-pointer hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:bg-dark-50 dark:hover:bg-dark-600 p-1 rounded-sm',
          { 'dark:bg-dark-600 bg-opacity-50 bg-dark-50': active },
          className
        )}
        {...divProps}
      >
        {children}
      </div>
    );
  }
);

Clickable.displayName = 'Clickable';
