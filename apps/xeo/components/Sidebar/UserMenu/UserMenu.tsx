import {
  CogIcon,
  HomeIcon,
  LogoutIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import { useDarkMode } from '@xeo/ui/lib/DarkModeButton/useDarkMode';
import { Popover } from '@xeo/ui/lib/Popover/Popover';
import classNames from 'classnames';
import { TeamSelector } from 'components/Team/TeamSelector/TeamSelector';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const UserMenu: React.FunctionComponent = () => {
  const { me } = useCurrentUser();
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
    <div>
      <div className="flex mb-2 items-center">
        <Image
          src={userImage}
          alt="Your Profile Picture"
          height={40}
          width={40}
          className="rounded-full"
        />
        <div className="ml-2">
          <p className="font-bold my-0">{me?.name}</p>
          <small className="text-dark-400">{me?.email}</small>
        </div>
        <div className="grow">
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
              <div className="cursor-pointer ml-2 text-dark-400">
                <div>
                  <CogIcon width={30} height={30} />
                </div>
              </div>
            }
          />
        </div>
      </div>
      <TeamSelector />
    </div>
  );
};
