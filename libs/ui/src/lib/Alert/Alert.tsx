import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  variation: 'success' | 'warning' | 'danger' | 'info';
}

const sharedIconProps: React.ComponentProps<'svg'> = {
  width: 40,
  height: 40,
  className: 'mr-3',
};

const getAlertStyleAndIcon = (variation: Props['variation']) => {
  switch (variation) {
    case 'success':
      return {
        style:
          'bg-green-100 dark:bg-green-100 text-green-600 dark:text-green-700',
        icon: <CheckCircleIcon {...sharedIconProps} />,
      };
    case 'warning':
      return {
        style:
          'bg-yellow-100 dark:bg-yellow-100 text-yellow-600 dark:text-yellow-700',
        icon: <ExclamationCircleIcon {...sharedIconProps} />,
      };
    case 'danger':
      return {
        style: 'bg-red-100 dark:bg-red-100 text-red-600 dark:text-red-700',
        icon: <ExclamationCircleIcon {...sharedIconProps} />,
      };
    case 'info':
      return {
        style:
          'bg-primary-100 dark:bg-primary-100 text-primary-600 dark:text-primary-700',
        icon: <InformationCircleIcon {...sharedIconProps} />,
      };
  }
};

export const Alert: React.FunctionComponent<Props> = ({
  variation,
  children,
  className,
}) => {
  const { style, icon } = getAlertStyleAndIcon(variation);

  return (
    <div
      className={classNames(
        'mb-10 flex flex-row items-center rounded-lg p-5',
        style,
        className
      )}
    >
      {icon}
      {children}
    </div>
  );
};
