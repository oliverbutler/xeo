import { SidebarItem } from '../SidebarItem.tsx/SidebarItem';
import { FiUser } from 'react-icons/fi';

export const UserRow: React.FunctionComponent = () => {
  return (
    <SidebarItem className="mb-2 flex items-center py-1">
      <FiUser />
      <span className="ml-2">John Smith</span>
    </SidebarItem>
  );
};
