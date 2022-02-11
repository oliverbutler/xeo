import { MoonIcon } from '@heroicons/react/outline';
import { Clickable } from '@xeo/ui';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

export const DarkModeButton: React.FunctionComponent = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Clickable
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="select-none"
    >
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
