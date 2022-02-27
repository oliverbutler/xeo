import { HomeIcon, LogoutIcon, MoonIcon } from '@heroicons/react/outline';
import { useDarkMode } from '@xeo/ui/lib/DarkModeButton/useDarkMode';
import { Popover } from '@xeo/ui/lib/Popover/Popover';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const UserMenu: React.FunctionComponent = () => {
  const session = useSession();
  const { pathname, push } = useRouter();
  const { theme, toggleTheme } = useDarkMode();

  const userImage = session.data?.user?.image;

  if (!userImage) {
    return null;
  }

  if (pathname.startsWith('/login')) {
    return null;
  }

  return (
    <Popover
      direction="left"
      items={[
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: <HomeIcon width={20} height={20} />,
        },
        {
          title: 'Logout',
          icon: <LogoutIcon width={20} height={20} />,
          onClick: () => signOut().then(() => push('/login')),
        },
        {
          icon: (
            <MoonIcon
              width={20}
              height={20}
              className={classNames({
                'fill-current text-white': theme === 'dark',
              })}
            />
          ),
          title: 'Theme',
          onClick: toggleTheme,
        },
      ]}
      button={
        <div className="cursor-pointer flex flex-row items-center justify-center">
          <Image
            src={userImage}
            alt="Your Profile Picture"
            height={35}
            width={35}
            className="rounded-full"
          />
        </div>
      }
    />
  );
};
