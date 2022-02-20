import { MoonIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { Clickable } from '../Clickable/Clickable';
import { useDarkMode } from './useDarkMode';

export const DarkModeButton: React.FunctionComponent = () => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Clickable onClick={toggleTheme} className="select-none">
      <MoonIcon
        width={20}
        height={20}
        className={classNames({
          'fill-current text-white': theme === 'dark',
        })}
      />
    </Clickable>
  );
};
