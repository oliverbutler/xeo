import classNames from 'classnames';

interface Props {
  text: string;
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark';
}

const mapStatusToColor = (
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-700/20';
    case 'secondary':
      return 'bg-secondary-700/20';
    case 'success':
      return 'bg-green-700/20';
    case 'danger':
      return 'bg-red-700/20';
    case 'warning':
      return 'bg-yellow-700/20';
    case 'info':
      return 'bg-blue-700/20';
    case 'dark':
      return 'bg-dark-700/20';
  }
};

export const Badge: React.FunctionComponent<Props> = ({ variant, text }) => {
  const color = mapStatusToColor(variant);

  return (
    <div
      className={classNames(
        'rounded-full',
        'px-2',
        'py-1',
        'text-xs',
        'font-semibold',
        'w-fit',
        color
      )}
    >
      {text}
    </div>
  );
};
