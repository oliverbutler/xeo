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
          'hover:bg-dark-200 dark:hover:bg-dark-600 border-b-primary-400 cursor-pointer rounded-sm border-b-4 border-opacity-0 p-1 transition-all hover:bg-opacity-50 dark:hover:bg-opacity-50',
          { 'dark:bg-dark-600 bg-dark-50 bg-opacity-50': active },
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
