import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import classNames from 'classnames';

interface Props {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  className?: string;
}

export const SprintStat: React.FunctionComponent<Props> = ({
  icon,
  title,
  value,
  className,
}) => {
  return (
    <Clickable className={classNames(className, 'flex flex-row items-center')}>
      <div id="icon-container" className="mr-1 flex">
        {icon}
      </div>
      <div id="text-container" className="">
        {value}
      </div>
    </Clickable>
  );
};
