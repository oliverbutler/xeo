import { IconButton } from 'components/IconButton/IconButton';
import { Resize } from 'components/Resize/Resize';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { SidebarItem } from './SidebarItem.tsx/SidebarItem';
import { UserRow } from './UserRow/UserRow';

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
      dragHandleWidth={3}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-100 hover:bg-gray-200"
    >
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          <UserRow />
          <SidebarItem>
            <p>Page 1</p>
          </SidebarItem>
          <SidebarItem>
            <p>Page 2</p>
          </SidebarItem>
        </div>
        <div className="mt-auto">
          <IconButton icon={<FiPlusCircle />} text="Add Page" />
        </div>
      </div>
    </Resize>
  );
};
