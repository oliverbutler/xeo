import { MoonIcon } from '@heroicons/react/outline';
import { Clickable, useLocalStorage } from '@xeo/ui';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

export const DarkModeButton: React.FunctionComponent = () => {
  const { setTheme, theme } = useTheme();
  const [_, storeTheme] = useLocalStorage<string | undefined>(
    'theme',
    undefined
  );

  const handleThemeChange = () => {
    if (theme === 'dark') {
      setTheme('light');
      storeTheme('light');
    } else {
      setTheme('dark');
      storeTheme('dark');
    }
  };

  return (
    <Clickable onClick={handleThemeChange} className="select-none">
      <MoonIcon
        width={25}
        height={25}
        className={classNames({
          'fill-current text-white': theme === 'dark',
        })}
      />
    </Clickable>
  );
};
