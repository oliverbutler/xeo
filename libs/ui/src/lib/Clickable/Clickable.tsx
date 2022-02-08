import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  active?: boolean;
  showActiveLabel?: boolean;
};

export const Clickable = forwardRef<HTMLDivElement, Props>(
  ({ children, className, active, showActiveLabel, ...divProps }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          'cursor-pointer hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:bg-dark-50 dark:hover:bg-dark-600 p-1 rounded-sm border-b-4 border-opacity-0 border-b-primary-400 transition-all',
          { 'dark:bg-dark-600 bg-opacity-50 bg-dark-50': active },
          { 'border-opacity-100': showActiveLabel },
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
