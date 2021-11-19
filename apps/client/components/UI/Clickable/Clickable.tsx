import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Clickable: React.FunctionComponent<Props> = ({
  children,
  className,
  ...divProps
}) => {
  return (
    <div
      className={classNames(
        'cursor-pointer hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 p-1 rounded-sm ',
        className
      )}
      {...divProps}
    >
      {children}
    </div>
  );
};
