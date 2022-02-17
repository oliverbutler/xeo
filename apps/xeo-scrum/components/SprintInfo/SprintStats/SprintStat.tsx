interface Props {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

export const SprintStat: React.FunctionComponent<Props> = ({
  icon,
  title,
  value,
}) => {
  return (
    <div className="bg-dark-50 dark:bg-dark-800 dark:border-l-dark-600 flex flex-row border-l-4 text-sm sm:text-base hover:scale-105 transition-all">
      <div id="icon-container" className="mx-2 flex items-center">
        {icon}
      </div>
      <div id="text-container" className="-mb-2 flex flex-col justify-center">
        <h3 className="m-0 mt-2">{title}</h3>
        {value}
      </div>
    </div>
  );
};
