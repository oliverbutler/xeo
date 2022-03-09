import {
  CogIcon,
  TemplateIcon,
  UserGroupIcon,
  ViewBoardsIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import xeoIcon from 'public/xeo.png';
import React from 'react';

interface Props {}

const NAVBAR_OPTIONS = [
  {
    title: 'Overview',
    options: [{ title: 'Dashboard', icon: TemplateIcon, path: '/' }],
  },
  {
    title: 'Current Sprint',
    options: [
      { title: 'Sprint', icon: ViewBoardsIcon, path: '/sprint' },
      { title: 'Dependencies', icon: ViewGridIcon, path: '/dependencies' },
    ],
  },
  {
    title: 'Team',
    options: [
      { title: 'Members', icon: UserGroupIcon, path: '/sprint' },
      { title: 'Sprints', icon: ViewBoardsIcon, path: '/dependencies' },
      { title: 'Settings', icon: CogIcon, path: '/dependencies' },
    ],
  },
  {
    title: 'Teams',
    options: [{ title: 'Manage Teams', icon: UserGroupIcon, path: '/sprint' }],
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

export const Sidebar: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="h-full bg-dark-900 w-72 text-white">
      <div className="font-bold flex flex-rows items-center p-4">
        <Image src={xeoIcon} height={25} width={25} />
        <span className="ml-2">Xeo</span>
      </div>
      <ul className="space-y-12 pl-0">
        {NAVBAR_OPTIONS.map((section) => (
          <NavbarSection {...section} />
        ))}
      </ul>
    </div>
  );
};
