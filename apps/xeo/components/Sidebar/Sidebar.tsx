import {
  CogIcon,
  MailIcon,
  TemplateIcon,
  UserGroupIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import { Sprint, Team } from '@prisma/client';
import { ConditionalWrapper } from '@xeo/ui/lib/ConditionalWrapper/ConditionalWrapper';
import classNames from 'classnames';
import { Logo } from 'components/Logo/Logo';
import { UserMenu } from 'components/Sidebar/UserMenu/UserMenu';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import xeoIcon from 'public/xeo.png';
import React, { useEffect, useState } from 'react';

const getNavbarOptions = (
  team: Team | undefined,
  sprint: Sprint | undefined
) => [
  {
    title: `Team (${team?.shortName ?? 'Missing'})`,
    options: [
      { title: 'Dashboard', icon: TemplateIcon, path: `/team/${team?.id}` },
      { title: 'Settings', icon: CogIcon, path: `/team/${team?.id}/settings` },
      // {
      //   title: 'Epic Dependencies',
      //   icon: ViewGridIcon,
      //   path: `/team/${team?.id}/epic`,
      //   disabled: true,
      // },
    ],
  },
  {
    title: `Sprint (${sprint?.name ?? 'Missing'})`,
    options: [
      {
        title: 'Sprint Dependencies',
        icon: ViewGridIcon,
        path: `/team/${team?.id}/dependencies`,
        disabled: !sprint,
      },
      // {
      //   title: 'Daily Mail',
      //   icon: MailIcon,
      //   path: '/daily-mail',
      //   disabled: true,
      // },
    ],
  },
  {
    title: 'Teams',
    options: [{ title: 'Manage Teams', icon: UserGroupIcon, path: '/teams' }],
  },
];

const isCurrentPath = (path: string) => {
  return window.location.pathname === path;
};

const NavbarSection: React.FunctionComponent<{
  title: string;
  options: { title: string; icon: any; path: string; disabled?: boolean }[];
}> = ({ title, options }) => {
  return (
    <div className="">
      <p className="uppercase font-bold text-sm text-dark-500 mb-1 pl-6">
        {title}
      </p>
      {options.map((option) => (
        <div
          key={option.title}
          className={classNames(
            `${
              isCurrentPath(option.path) ? 'border-white' : 'border-transparent'
            } border-l-4 px-4`,
            { 'opacity-20': option.disabled }
          )}
        >
          <ConditionalWrapper
            condition={!option.disabled}
            wrapper={(c) => <Link href={option.path}>{c}</Link>}
          >
            <li
              className={classNames(
                'list-none  p-2 rounded-xl pl-2 flex flex-row gap-2 items-center',
                { 'hover:bg-dark-800 cursor-pointer': !option.disabled }
              )}
            >
              <option.icon height={25} width={25} />
              {option.title}
            </li>
          </ConditionalWrapper>
        </div>
      ))}
    </div>
  );
};

function useToggleMenu() {
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const onMenuToggle = () => {
    setMenuShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto';
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
      }
      return !status;
    });
  };
  return { menuShow, onMenuToggle };
}

export const NavbarButton: React.FunctionComponent<{
  isOpened: boolean;
  onClick: () => void;
}> = ({ isOpened, onClick }) => {
  return (
    <button
      style={{ zIndex: 1000 }}
      type="button"
      className="flex h-8 w-8 cursor-pointer rounded bg-transparent"
      onClick={onClick}
      aria-label="Toggle Menu"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-8 w-8  text-gray-900 dark:text-gray-100"
      >
        <path
          className={`${isOpened ? 'opened' : ''} line line1`}
          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        />
        <path
          className={`${isOpened ? 'opened' : ''} line line2`}
          d="M 20,50 H 80"
        />
        <path
          className={`${isOpened ? 'opened' : ''} line line3`}
          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        />
      </svg>
    </button>
  );
};

export const Sidebar: React.FunctionComponent = () => {
  const { menuShow, onMenuToggle } = useToggleMenu();
  const { team, currentSprint, currentTeamId } = useCurrentTeam();
  const { me } = useCurrentUser();
  const { pathname, push, query } = useRouter();

  const { teamId } = query;

  const pathsToRedirect = ['/', '/team', '/team/[teamId]'];

  useEffect(() => {
    if (teamId === 'undefined') {
      push(`/`);
    }

    if (pathsToRedirect.includes(pathname) && currentTeamId) {
      push(`/team/${currentTeamId}`);
    }
  }, [team, me]);

  const navbarOptions = getNavbarOptions(team, currentSprint);

  // On a page change, close the mobile menu
  useEffect(() => {
    if (menuShow) {
      onMenuToggle();
    }
  }, [pathname]);

  return (
    <>
      <div className="flex items-center md:hidden absolute mt-2">
        <NavbarButton onClick={onMenuToggle} isOpened={menuShow} />
      </div>
      <nav className="bg-dark-900 dark:bg-dark-950 hidden md:flex w-72 text-white flex-col">
        <ul className="space-y-12 pl-0 grow">
          {navbarOptions.map((section) => (
            <NavbarSection key={section.title} {...section} />
          ))}
        </ul>
        <div className="mx-4 my-4">
          <UserMenu />
        </div>
      </nav>
      <div
        style={{ zIndex: 100000 }}
        className={`fixed left-0 h-screen w-full transform overflow-auto bg-white duration-500 ease-in-out dark:bg-black md:hidden ${
          menuShow ? 'translate-x-0' : '-translate-x-full'
        } firefox:bg-opacity-100 dark:firefox:bg-opacity-100 bg-opacity-30 backdrop-blur-lg backdrop-saturate-150 backdrop-filter dark:bg-opacity-30`}
      >
        <nav className="mt-12 h-full space-y-8">
          <ul className="space-y-12 pl-0 grow">
            {navbarOptions.map((section) => (
              <NavbarSection key={section.title} {...section} />
            ))}
          </ul>
          <div className="mx-4 my-4">
            <UserMenu />
          </div>
        </nav>
      </div>
    </>
  );
};
