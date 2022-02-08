import {
  CollectionIcon,
  DatabaseIcon,
  LogoutIcon,
  UserIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import { CentredLoader, Loader, Resize, useLocalStorage } from '@xeo/ui';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SidebarItem } from './SidebarItem/SidebarItem';

const sidebar = [
  {
    title: 'All Backlogs',
    url: '/',
    icon: <CollectionIcon height={20} width={20} />,
  },
  {
    title: 'Add Notion Board',
    url: '/new-backlog',
    icon: <ViewGridAddIcon width={20} height={20} />,
  },
  {
    title: 'All Sprints',
    url: '/sprint',
    icon: <DatabaseIcon height={20} width={20} />,
  },
];

export const Sidebar = () => {
  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const session = useSession();
  const { push } = useRouter();

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={2}
      className="bg-dark-50 h-full dark:bg-transparent"
      dragHandleClassName="bg-dark-50 dark:bg-dark-800 hover:bg-dark-200"
    >
      <div className="flex h-full flex-col">
        <div>
          {session?.data?.user ? (
            <div className="flex flex-row items-center p-2">
              {session.data.user.image ? (
                <Image
                  src={session.data.user.image}
                  height={30}
                  width={30}
                  alt="User Image"
                  className="rounded-full"
                />
              ) : (
                <UserIcon height={30} width={30} />
              )}
              <div className="pl-2">{session.data?.user?.name}</div>
              <LogoutIcon
                onClick={() => signOut().then(() => push('/login'))}
                width={30}
                height={30}
                className="hover:bg-dark-700 ml-auto cursor-pointer p-1"
              />
            </div>
          ) : (
            <CentredLoader />
          )}
        </div>
        <div>
          {sidebar.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <SidebarItem className="text-dark-700 mt-1 flex items-center py-2 text-sm dark:text-white">
                {item.icon}
                <span className={classNames('ml-2')}>{item.title}</span>
              </SidebarItem>
            </Link>
          ))}
        </div>
      </div>
    </Resize>
  );
};
