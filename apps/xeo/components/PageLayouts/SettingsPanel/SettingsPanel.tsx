import classNames from 'classnames';

interface Props {
  outline?: boolean;
  className?: string;
}

export const SettingsPanel: React.FunctionComponent<Props> = ({
  children,
  outline,
  className,
}) => {
  if (outline) {
    return (
      <div
        className={classNames(
          'rounded-lg outline-dashed outline-8 col-span-3 flex items-center justify-center outline-dark-600/20 m-2 py-12 flex-col',
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'space-y-4 dark:bg-dark-950 bg-white p-4 mt-4 rounded-md',
        className
      )}
    >
      {children}
    </div>
  );
};
