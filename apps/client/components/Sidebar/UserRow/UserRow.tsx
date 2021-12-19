import { SidebarItem } from '../SidebarItem/SidebarItem';
import { FiMoreHorizontal, FiUser } from 'react-icons/fi';
import { GetMeQuery } from 'generated';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { Clickable } from 'components/UI/Clickable/Clickable';
import Image from 'next/image';

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
    <div className="flex flex-row items-center w-full justify-between p-2 mb-4 dark:border-dark-800  border-b-2">
      <Clickable>
        {user.avatar ? (
          <Image
            className="w-5 h-5"
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
          />
        ) : (
          <FiUser className="w-5 h-5" />
        )}
      </Clickable>
      <span className="ml-2">
        {user.firstName} {user.lastName}
      </span>
      <Dropdown
        showDirection="left"
        button={
          <Clickable>
            <FiMoreHorizontal />
          </Clickable>
        }
        items={[[{ text: 'Log out', logo: <FiUser />, onClick: handleLogOut }]]}
      />
    </div>
  );
};
