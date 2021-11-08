import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { SidebarItem } from './SidebarItem.tsx/SidebarItem';
import { UserRow } from './UserRow/UserRow';
import Link from 'next/link';
import { ImageRenderer } from 'components/Image/ImageRenderer';
import classNames from 'classnames';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const rootPages = user?.pages ?? [];

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-50"
      dragHandleClassName="bg-gray-50 hover:bg-gray-200 "
    >
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          {user && (
            <>
              <UserRow user={user} />
              {rootPages.map((page) => {
                return (
                  <Link href={`/page/${page.id}`} key={page.id}>
                    <SidebarItem className="text-gray-700 text-sm flex items-center">
                      <ImageRenderer image={page.properties.image} />
                      <span
                        className={classNames('ml-2', {
                          'text-gray-300': !page.properties.title.rawText,
                        })}
                      >
                        {page.properties.title.rawText || 'Untitled'}
                      </span>
                    </SidebarItem>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Resize>
  );
};
