import { IconButton } from 'components/IconButton/IconButton';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { FiPlusCircle } from 'react-icons/fi';
import { SidebarItem } from './SidebarItem.tsx/SidebarItem';
import { UserRow } from './UserRow/UserRow';
import Link from 'next/link';
import { PageBlock } from 'generated';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const pages = user?.blocks ?? [];

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-100 hover:bg-gray-200"
    >
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          {user && (
            <>
              <UserRow user={user} />
              {pages.map((page) => {
                if (page.__typename === 'PageBlock') {
                  return (
                    <Link href={`/page/${page.id}`} key={page.id}>
                      <SidebarItem className="text-gray-700 text-sm">
                        <span className="mr-1">{page.emoji}</span> {page.title}
                      </SidebarItem>
                    </Link>
                  );
                }
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
