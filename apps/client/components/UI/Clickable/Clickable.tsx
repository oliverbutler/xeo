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
        'cursor-pointer hover:bg-gray-100 p-1 rounded-sm',
        className
      )}
      {...divProps}
    >
      {children}
    </div>
  );
};
