import { MoonIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { Clickable } from '../Clickable/Clickable';

export const DarkModeButton: React.FunctionComponent = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Clickable onClick={handleThemeChange} className="select-none">
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
