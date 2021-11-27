import { Tab } from '@headlessui/react';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { UserRow } from './UserRow/UserRow';
import { SidebarItem } from './SidebarItem/SidebarItem';
import Link from 'next/link';
import classNames from 'classnames';
import { SidebarGraphTabs } from './SidebarGraphTabs/SidebarGraphTabs';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-50 dark:bg-transparent h-full"
      dragHandleClassName="bg-gray-50 dark:bg-black hover:bg-gray-200"
    >
      <div className="dark:bg-transparent flex flex-col justify-between h-full">
        <div>
          {user ? <UserRow user={user} /> : <p>Not logged in</p>}
          {user?.pages?.map((page) => (
            <Link href={`/page/${page.id}`} key={page.id}>
              <SidebarItem className="text-gray-700 dark:text-white text-sm flex items-center">
                <span>{page.emoji}</span>
                <span
                  className={classNames('ml-2', {
                    'text-gray-300': !page.titlePlainText,
                  })}
                >
                  {page.titlePlainText || 'Untitled'}
                </span>
              </SidebarItem>
            </Link>
          ))}
        </div>
        <div>
          <SidebarGraphTabs />
        </div>
      </div>
    </Resize>
  );
};
