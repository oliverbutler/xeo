import { MoonIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { Clickable } from '../Clickable/Clickable';
import { useDarkMode } from './useDarkMode';

export const DarkModeButton: React.FunctionComponent<{ size?: number }> = ({
  size = 20,
}) => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Clickable onClick={toggleTheme} className="select-none">
      <MoonIcon
        width={size}
        height={size}
        className={classNames({
          'fill-current text-white': theme === 'dark',
        })}
      />
    </Clickable>
  );
};
