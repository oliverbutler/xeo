import {
  CogIcon,
  TemplateIcon,
  UserGroupIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import { Team } from '@prisma/client';
import { UserMenu } from 'components/Sidebar/UserMenu/UserMenu';
import { TeamSelector } from 'components/Team/TeamSelector/TeamSelector';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import xeoIcon from 'public/xeo.png';
import React, { useEffect } from 'react';

const getNavbarOptions = (team: Team) => [
  {
    title: `Team (${team.shortName})`,
    options: [
      { title: 'Dashboard', icon: TemplateIcon, path: `/team/${team.id}` },
      { title: 'Settings', icon: CogIcon, path: `/team/${team.id}/settings` },
    ],
  },
  {
    title: 'Current Sprint',
    options: [
      { title: 'Sprint', icon: ViewBoardsIcon, path: '/sprint' },
      { title: 'Dependencies', icon: ViewGridIcon, path: '/dependencies' },
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
  options: { title: string; icon: any; path: string }[];
}> = ({ title, options }) => {
  return (
    <div className="">
      <p className="uppercase font-bold text-sm text-dark-500 mb-1 pl-6">
        {title}
      </p>
      {options.map((option) => (
        <div
          className={`${
            isCurrentPath(option.path) ? 'border-white' : 'border-transparent'
          } border-l-4 px-4`}
        >
          <Link href={option.path}>
            <li className="list-none hover:bg-dark-800 cursor-pointer p-2 rounded-xl pl-2 flex flex-row gap-2 items-center ">
              <option.icon height={25} width={25} />
              {option.title}
            </li>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const Sidebar: React.FunctionComponent = () => {
  const { team } = useCurrentTeam();
  const { me } = useCurrentUser();
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === '/' && me?.metadata?.defaultTeamId) {
      push(`/team/${me.metadata.defaultTeamId}`);
    }
  });

  const navbarOptions = team ? getNavbarOptions(team) : [];

  return (
    <div className="h-screen bg-dark-900 dark:bg-dark-950 w-72 text-white flex flex-col">
      <div className="font-bold flex flex-rows items-center p-4">
        <Image src={xeoIcon} height={25} width={25} />
        <span className="ml-2">Xeo</span>
      </div>
      <ul className="space-y-12 pl-0 grow">
        {navbarOptions.map((section) => (
          <NavbarSection {...section} />
        ))}
      </ul>
      <div className="mx-4 my-4">
        <UserMenu />
      </div>
    </div>
  );
};
