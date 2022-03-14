import classNames from 'classnames';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  border?: boolean;
  rightContent?: React.ReactNode;
};

export const PageHeader: React.FunctionComponent<PageHeaderProps> = ({
  title,
  subtitle,
  border,
  rightContent,
}) => {
  return (
    <div
      className={classNames('overflow-auto p-4 bg-white dark:bg-dark-950', {
        'border-b-2 dark:border-b-dark-700 border-b-dark-200': border,
      })}
    >
      <div className="flex flex-row grow">
        <div className="grow">
          <h2 className="mb-0 mt-0">{title}</h2>
          <p className="mt-2 mb-0">{subtitle}</p>
        </div>
        <div className="flex flex-row items-center">{rightContent}</div>
      </div>
    </div>
  );
};
