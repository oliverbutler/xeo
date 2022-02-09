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
    <div className="w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className="bg-dark-800 border-l-dark-600 flex flex-row border-l-4">
        <div id="icon-container" className="mx-4 flex items-center">
          {icon}
        </div>
        <div id="text-container" className="flex flex-col justify-center">
          <h3 className="m-0 mt-4">{title}</h3>
          {value}
        </div>
      </div>
    </div>
  );
};
