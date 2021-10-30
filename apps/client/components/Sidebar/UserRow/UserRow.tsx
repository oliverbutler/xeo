import { SidebarItem } from '../SidebarItem.tsx/SidebarItem';
import { FiUser } from 'react-icons/fi';
import { useCurrentUser } from 'hooks/useCurrentUser';

export const UserRow: React.FunctionComponent = () => {
  const { user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <SidebarItem className="mb-2 flex items-center py-1">
      {user.avatar ? (
        <img
          className="w-5 h-5"
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
        />
      ) : (
        <FiUser className="w-5 h-5 mr-3" />
      )}
      <span className="ml-2">
        {user.firstName} {user.lastName}
      </span>
    </SidebarItem>
  );
};
