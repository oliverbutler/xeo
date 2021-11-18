import { SidebarItem } from '../SidebarItem/SidebarItem';
import { FiMoreHorizontal, FiUser } from 'react-icons/fi';
import { GetMeQuery } from 'generated';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { Clickable } from 'components/UI/Clickable/Clickable';

interface Props {
  user: GetMeQuery['me'];
}

export const UserRow: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();

  const { formatMessage } = useIntl();

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
    toast.success(formatMessage({ id: 'generic.logout.success' }));
  };

  return (
    <div className="flex flex-row items-center w-full justify-between p-2 mb-4 border-b-gray-200 border-2">
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
      <Dropdown
        showDirection="left"
        button={
          <Clickable className="hover:bg-gray-400">
            <FiMoreHorizontal />
          </Clickable>
        }
        items={[[{ text: 'Log out', logo: <FiUser />, onClick: handleLogOut }]]}
      />
    </div>
  );
};
