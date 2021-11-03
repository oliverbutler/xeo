import { IconButton } from 'components/IconButton/IconButton';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { FiPlusCircle } from 'react-icons/fi';
import { SidebarItem } from './SidebarItem.tsx/SidebarItem';
import { UserRow } from './UserRow/UserRow';
import Link from 'next/link';
import { ImageRenderer } from 'components/Image/ImageRenderer';

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
      dragHandleClassName="bg-gray-50 hover:bg-gray-200"
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
                      <span className="ml-2">
                        {page.properties.title.rawText}
                      </span>
                    </SidebarItem>
                  </Link>
                );
              })}
            </>
          )}
        </div>
        <div className="mt-auto">
          <IconButton icon={<FiPlusCircle />} text="Add Page" />
        </div>
      </div>
    </Resize>
  );
};
