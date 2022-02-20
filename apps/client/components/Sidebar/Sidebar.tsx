import { useCurrentUser } from 'hooks/useCurrentUser/useCurrentUser';
import { UserRow } from './UserRow/UserRow';
import { SidebarItem } from './SidebarItem/SidebarItem';
import Link from 'next/link';
import classNames from 'classnames';
import { SidebarGraphTabs } from './SidebarGraphTabs/SidebarGraphTabs';
import { Resize, useLocalStorage } from '@xeo/ui';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const pages = [...(user?.pages ?? [])].sort((a, b) =>
    a.titlePlainText.localeCompare(b.titlePlainText)
  );

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={2}
      className="bg-dark-50 dark:bg-transparent h-screen"
      dragHandleClassName="bg-dark-50 dark:bg-dark-800 hover:bg-dark-200"
    >
      <div className="dark:bg-transparent flex flex-col justify-between h-full">
        <div>
          {user ? <UserRow user={user} /> : <p>Not logged in</p>}
          {pages?.map((page) => (
            <Link href={`/page/${page.id}`} key={page.id} passHref={true}>
              <SidebarItem className="text-dark-700 dark:text-white text-sm flex items-center">
                <span>{page.emoji}</span>
                <span
                  className={classNames('ml-2', {
                    'text-dark-300': !page.titlePlainText,
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
