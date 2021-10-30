import { IconButton } from 'components/IconButton/IconButton';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { SidebarItem } from './SidebarItem.tsx/SidebarItem';
import { UserRow } from './UserRow/UserRow';
import Link from 'next/link';

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
      className="bg-gray-100"
      dragHandleClassName="bg-gray-100 hover:bg-gray-200"
    >
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          {user && (
            <>
              <UserRow user={user} />
              {user.blocks?.map((page) => (
                <Link href={`/page/${page.id}`}>
                  <SidebarItem className="text-gray-700 text-sm" key={page.id}>
                    {page.emoji} {page.title}
                  </SidebarItem>
                </Link>
              ))}
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
