import { IconButton } from 'components/IconButton/IconButton';
import { Resize } from 'components/Resize/Resize';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

export const Sidebar = () => {
  // Store sidebar width in local storage
  const [defaultWidth, setDefaultWidth] = useLocalStorage('sidebar-width', 192);

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={4}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-200"
    >
      <div className="flex flex-col h-full py-2">
        <div className="overflow-auto h-full">
          <p>item 1</p>
          <p>item 2</p>
        </div>
        <div className="mt-auto">
          <IconButton icon={<FiPlusCircle />} text="Add Page" />
        </div>
      </div>
    </Resize>
  );
};
