import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';

type Props = {
  className?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const SidebarItem = forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...divProps }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          'hover:bg-dark-200 dark:hover:bg-opacity-50 dark:hover:bg-dark-600 py-1 px-2 cursor-pointer ',
          className
        )}
        {...divProps}
      >
        {children}
      </div>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';
