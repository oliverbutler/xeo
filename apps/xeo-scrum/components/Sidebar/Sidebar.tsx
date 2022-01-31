import { Button, ButtonVariation, Resize, useLocalStorage } from '@xeo/ui';
import classNames from 'classnames';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { SidebarItem } from './SidebarItem/SidebarItem';

const sidebar = [
  { title: 'Backlog', url: '/' },
  { title: 'Sprint', url: '/sprint' },
];

const bottomItems = [{ title: 'Add Notion Board', url: '/new-backlog' }];

export const Sidebar = () => {
  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={2}
      className="bg-dark-50 dark:bg-transparent h-full"
      dragHandleClassName="bg-dark-50 dark:bg-dark-800 hover:bg-dark-200"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {sidebar.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <SidebarItem className="text-dark-700 dark:text-white text-sm flex items-center">
                <span className={classNames('ml-2')}>{item.title}</span>
              </SidebarItem>
            </Link>
          ))}
        </div>
        <div>
          {bottomItems.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <SidebarItem className="text-dark-700 dark:text-white text-sm flex items-center">
                <span className={classNames('ml-2')}>{item.title}</span>
              </SidebarItem>
            </Link>
          ))}
          <Button variation={ButtonVariation.Dark} onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    </Resize>
  );
};
