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
          'hover:bg-gray-200 py-1 px-2 cursor-pointer ',
          className
        )}
        {...divProps}
      >
        {children}
      </div>
    );
  }
);
