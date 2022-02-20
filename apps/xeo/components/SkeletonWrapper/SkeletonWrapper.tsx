import { useTheme } from 'next-themes';
import { SkeletonTheme } from 'react-loading-skeleton';
import { theme } from '../../../../tailwind-workspace-preset';

export const SkeletonWrapper: React.FunctionComponent = ({ children }) => {
  const nextTheme = useTheme();

  const isDarkTheme = nextTheme.theme === 'dark';

  return (
    <SkeletonTheme
      baseColor={
        isDarkTheme
          ? theme.extend.colors.dark[800]
          : theme.extend.colors.dark[200]
      }
      highlightColor={
        isDarkTheme
          ? theme.extend.colors.dark[600]
          : theme.extend.colors.dark[50]
      }
    >
      {children}
    </SkeletonTheme>
  );
};
