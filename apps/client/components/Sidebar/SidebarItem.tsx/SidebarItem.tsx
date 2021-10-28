import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = {
  className?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const SidebarItem: React.FunctionComponent<Props> = ({
  children,
  className,
  ...divProps
}) => {
  return (
    <div
      className={classNames(
        'hover:bg-gray-200 py-1 px-2 cursor-pointer',
        className
      )}
      {...divProps}
    >
      {children}
    </div>
  );
};
