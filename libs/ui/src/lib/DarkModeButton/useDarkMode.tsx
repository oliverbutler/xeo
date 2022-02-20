import { useTheme } from 'next-themes';

interface Output {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useDarkMode = (): Output => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return {
    theme: theme as 'light' | 'dark',
    toggleTheme,
  };
};
