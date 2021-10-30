import { SidebarItem } from '../SidebarItem.tsx/SidebarItem';
import { FiUser } from 'react-icons/fi';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { GetMeQuery } from 'generated';

interface Props {
  user: GetMeQuery['me'];
}

export const UserRow: React.FunctionComponent<Props> = ({ user }) => {
  return (
    <SidebarItem className="mb-2 flex items-center py-1 ">
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
